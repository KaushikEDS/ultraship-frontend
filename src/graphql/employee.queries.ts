import { gql } from '@apollo/client';

export const GET_EMPLOYEES = gql`
  query GetEmployees($filter: EmployeeFilterInput) {
    employees(filter: $filter) {
      id
      name
      age
      class
      subjects
      attendance
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMPLOYEES_PAGINATED = gql`
  query GetEmployeesPaginated(
    $pagination: PaginationInput!
    $filter: EmployeeFilterInput
  ) {
    employeesPaginated(pagination: $pagination, filter: $filter) {
      items {
        id
        name
        age
        class
        subjects
        attendance
        createdAt
        updatedAt
      }
      total
      hasMore
      currentPage
      totalPages
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: Int!) {
    employee(id: $id) {
      id
      name
      age
      class
      subjects
      attendance
      createdAt
      updatedAt
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: CreateEmployeeInput!) {
    addEmployee(input: $input) {
      id
      name
      age
      class
      subjects
      attendance
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: Int!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      name
      age
      class
      subjects
      attendance
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: Int!) {
    deleteEmployee(id: $id) {
      id
      name
    }
  }
`;

