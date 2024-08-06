import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../lib/axios/axios-client";

const phoneRegex = new RegExp(/^[6-9]\d{9}$/);

const formSchema = z.object({
  firstName: z
    .string()
    .min(3, {
      message: "First name must be at least 3 characters!",
    })
    .max(100, {
      message: "First name can be at max 100 characters!",
    }),
  lastName: z
    .string()
    .min(3, {
      message: "Last name must be at least 3 characters!",
    })
    .max(100, {
      message: "Last name can be at max 100 characters!",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required!" })
    .email("This is not a valid email!"),
  phone: z
    .string()
    .length(10, {
      message: "Phone number must be exactly 10 characters!",
    })
    .regex(phoneRegex, "This is not a valid phone number!"),
});

function UpdateUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    isPending: userInfoIsPending,
    error: userInfoError,
    data: userInfo,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      axiosClient.get(`/user-information/${id}`).then((res) => res.data),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (userInfo) {
      setValue("firstName", userInfo.firstName);
      setValue("lastName", userInfo.lastName);
      setValue("email", userInfo.email);
      setValue("phone", userInfo.phone);
    }
  }, [setValue, userInfo]);

  const updateUser = useMutation({
    mutationFn: (values: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    }) =>
      axiosClient
        .put(`/user-information/${id}`, values)
        .then((response) => response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast("User info updated!");
      reset();
      navigate("/users");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log("error > > ", error.response.data.error);
      toast(error.response.data.error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateUser.mutateAsync(values);
  }

  return (
    <Container className="font-oswald">
      <Row>
        <Col>
          <h1 className="h1 fw-bold py-3 py-lg-5">Personal information</h1>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2
            className="h2 fw-semibold pb-2 pb-lg-3"
            style={{ color: "#dadde5" }}
          >
            About You
          </h2>
        </Col>
      </Row>
      {userInfoIsPending && <>Fetching User Info</>}
      {!userInfoIsPending && (
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4" controlId="formFirstName">
                  <Form.Label className="fw-light">First Name</Form.Label>

                  <Form.Control
                    disabled={updateUser.isPending}
                    type="text"
                    className="fw-light p-3"
                    {...register("firstName")}
                  />

                  {errors.firstName && (
                    <Form.Text className="text-danger">
                      {errors.firstName.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-4" controlId="formLastName">
                  <Form.Label className="fw-light">Last Name</Form.Label>

                  <Form.Control
                    disabled={updateUser.isPending}
                    type="text"
                    className="fw-light p-3"
                    {...register("lastName")}
                  />

                  {errors.lastName && (
                    <Form.Text className="text-danger">
                      {errors.lastName.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4" controlId="formFirstName">
                  <Form.Label className="fw-light">Email</Form.Label>

                  <Form.Control
                    disabled={updateUser.isPending}
                    type="email"
                    className="fw-light p-3"
                    {...register("email")}
                  />

                  {errors.email && (
                    <Form.Text className="text-danger">
                      {errors.email.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-4" controlId="formLastName">
                  <Form.Label className="fw-light">Phone</Form.Label>

                  <Form.Control
                    disabled={updateUser.isPending}
                    type="text"
                    className="fw-light p-3"
                    {...register("phone")}
                  />

                  {errors.phone && (
                    <Form.Text className="text-danger">
                      {errors.phone.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col className="d-flex justify-content-center align-items-center py-2 py-lg-3">
                <Button
                  disabled={updateUser.isPending}
                  variant="dark"
                  className="rounded-3 py-3 px-5"
                  type="submit"
                >
                  Update
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      )}

      {userInfoError && <Col>Error Fetching Users</Col>}

      <ToastContainer position="bottom-right" />
    </Container>
  );
}

export default UpdateUserPage;
