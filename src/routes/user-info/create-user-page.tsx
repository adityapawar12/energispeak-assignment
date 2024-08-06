import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../lib/axios/axios-client";

const formSchema = z.object({
  firstName: z
    .string()
    .min(3, {
      message: "First name must be at least 3 characters.",
    })
    .max(100, {
      message: "First name can be at max 100 characters.",
    }),
  lastName: z
    .string()
    .min(3, {
      message: "Last name must be at least 3 characters.",
    })
    .max(100, {
      message: "Last name can be at max 100 characters.",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("This is not a valid email."),
  phone: z
    .string()
    .min(1, {
      message: "Phone number can only be be 10 characters.",
    })
    .max(10, {
      message: "Phone number can only be be 10 characters.",
    }),
});

function CreateUserPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const createUser = useMutation({
    mutationFn: (values: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    }) =>
      axiosClient
        .post("/user-information", values)
        .then((response) => response),
    onSuccess: () => {
      toast("User info submitted!");
      reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log("error > > ", error.response.data.error);
      toast(error.response.data.error);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values >>> ", values);
    createUser.mutateAsync(values);
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

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-4" controlId="formFirstName">
              <Form.Label className="fw-light">First Name</Form.Label>

              <Form.Control
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              variant="dark"
              className="rounded-3 py-3 px-5"
              type="submit"
            >
              Create
            </Button>
          </Col>
        </Row>
      </Form>
      <ToastContainer position="bottom-right" />
    </Container>
  );
}

export default CreateUserPage;
