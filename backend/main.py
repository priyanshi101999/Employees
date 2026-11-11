from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_employee_or_404(employee_id: int, db: Session):
    employee = db.get(models.Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@app.get("/employees", response_model=list[schemas.EmployeeOut])
def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).order_by(models.Employee.id.desc()).all()


@app.post("/employees", response_model=schemas.EmployeeOut, status_code=201)
def create_employee(data: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    employee = models.Employee(**data.model_dump())
    db.add(employee)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists")
    db.refresh(employee)
    return employee


@app.put("/employees/{employee_id}", response_model=schemas.EmployeeOut)
def update_employee(
    employee_id: int, data: schemas.EmployeeUpdate, db: Session = Depends(get_db)
):
    employee = get_employee_or_404(employee_id, db)
    for key, value in data.model_dump().items():
        setattr(employee, key, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists")
    db.refresh(employee)
    return employee


@app.delete("/employees/{employee_id}", status_code=204)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = get_employee_or_404(employee_id, db)
    db.delete(employee)
    db.commit()
    return Response(status_code=204)
