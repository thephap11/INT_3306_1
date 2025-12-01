import { User, Field } from '../../models/index.js';
import { Op } from 'sequelize';

/**
 * Get all employees (users with role = 'manager')
 */
export const getAllEmployeesService = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, search = '', status = '' } = { ...filters, ...pagination };
  const offset = (page - 1) * limit;

  const whereClause = { role: 'manager' };
  
  if (search) {
    whereClause[Op.or] = [
      { person_name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } }
    ];
  }
  
  if (status) whereClause.status = status;

  const { count, rows } = await User.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['person_id', 'DESC']],
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Field,
        as: 'managedFields',
        attributes: ['field_id', 'field_name', 'location', 'status']
      }
    ]
  });

  return {
    employees: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * Get employee by ID
 */
export const getEmployeeByIdService = async (id) => {
  const employee = await User.findOne({
    where: {
      person_id: id,
      role: 'manager'
    },
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Field,
        as: 'managedFields',
        attributes: ['field_id', 'field_name', 'location', 'status']
      }
    ]
  });

  return employee;
};

/**
 * Create new employee
 */
export const createEmployeeService = async (employeeData) => {
  // Force role to manager
  const employee = await User.create({
    ...employeeData,
    role: 'manager'
  });

  const employeeObj = employee.toJSON();
  delete employeeObj.password;
  return employeeObj;
};

/**
 * Update employee
 */
export const updateEmployeeService = async (id, employeeData) => {
  const employee = await User.findOne({
    where: {
      person_id: id,
      role: 'manager'
    }
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  // Don't allow password or role change through this method
  delete employeeData.password;
  delete employeeData.role;

  await employee.update(employeeData);
  const updatedEmployee = employee.toJSON();
  delete updatedEmployee.password;
  return updatedEmployee;
};

/**
 * Delete employee
 */
export const deleteEmployeeService = async (id) => {
  const employee = await User.findOne({
    where: {
      person_id: id,
      role: 'manager'
    }
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  // Check if employee is managing any fields
  const managedFields = await Field.count({
    where: { manager_id: id }
  });

  if (managedFields > 0) {
    throw new Error('Cannot delete employee who is managing fields. Please reassign fields first.');
  }

  await employee.update({ status: 'inactive' });
  return { message: 'Employee deleted successfully' };
};

/**
 * Assign field to employee
 */
export const assignFieldToEmployeeService = async (employeeId, fieldId) => {
  const employee = await User.findOne({
    where: {
      person_id: employeeId,
      role: 'manager'
    }
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  const field = await Field.findByPk(fieldId);
  if (!field) {
    throw new Error('Field not found');
  }

  await field.update({ manager_id: employeeId });
  
  return {
    message: 'Field assigned to employee successfully',
    field: field
  };
};

/**
 * Get employee statistics
 */
export const getEmployeeStatsService = async () => {
  const totalEmployees = await User.count({ where: { role: 'manager' } });
  const activeEmployees = await User.count({ where: { role: 'manager', status: 'active' } });
  const inactiveEmployees = await User.count({ where: { role: 'manager', status: 'inactive' } });

  return {
    total: totalEmployees,
    active: activeEmployees,
    inactive: inactiveEmployees
  };
};
