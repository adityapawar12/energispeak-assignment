import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import DeleteIcon from "/delete-icon.svg";
import EditIcon from "/edit-icon.svg";
import { Link } from "react-router-dom";
import axiosClient from "../../lib/axios/axios-client";

function ListUsersPage() {
  const queryClient = useQueryClient();

  const {
    isPending: usersListIsPending,
    error: usersListError,
    data: usersList,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => axiosClient.get("/user-information").then((res) => res.data),
  });

  const deleteUser = useMutation({
    mutationFn: (userId: string) =>
      axiosClient.delete(`/user-information/${userId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <Container className="font-oswald">
      {!usersListIsPending && usersList.length > 0 ? (
        <>
          <Row>
            <Col className="d-flex justify-content-between align-items-center">
              <h1 className="h1 fw-bold py-3 py-lg-5">Personal information</h1>
              <Link to={"/users/create"}>
                <Button variant="dark">Create New User</Button>
              </Link>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <Col>
              <h1 className="h1 fw-bold py-3 py-lg-5">Personal information</h1>
            </Col>
          </Row>
        </>
      )}

      <Row>
        {usersListIsPending && (
          <Col>
            <p className="fw-medium py-3">Fetching Users</p>
          </Col>
        )}

        {!usersListIsPending && (
          <>
            {usersList.length > 0 ? (
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(
                      (
                        user: {
                          _id: string;
                          firstName: string;
                          lastName: string;
                          email: string;
                          phone: string;
                        },
                        index: number
                      ) => (
                        <tr key={user._id}>
                          <td>{index + 1}</td>
                          <td>{user.firstName}</td>
                          <td>{user.lastName}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>
                            <Link to={`/users/update/${user._id}`}>
                              <Button variant="primary" className="me-3">
                                <img
                                  src={EditIcon}
                                  className="text-white "
                                  alt="Edit User"
                                />
                              </Button>
                            </Link>
                            <Button
                              variant="danger"
                              onClick={() => {
                                deleteUser.mutateAsync(user._id);
                              }}
                            >
                              <img src={DeleteIcon} alt="Delete User" />
                            </Button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </Col>
            ) : (
              <Col className="d-flex flex-column justify-content-center align-items-center">
                <p>No users</p>
                <Link to={"/users/create"}>
                  <Button variant="dark">Create New User</Button>
                </Link>
              </Col>
            )}
          </>
        )}

        {usersListError && <Col>Error Fetching Users</Col>}
      </Row>

      <ToastContainer position="bottom-right" />
    </Container>
  );
}

export default ListUsersPage;
