import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { auth } from "../../Firebase/firebaseConfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Por favor ingrese un número celular")
    .matches(/^[0-9]+$/, "Debe contener solo números del 0 al 9")
    .max(10, "El número celular debe tener 10 dígitos")
    .min(10, "El número celular debe tener 10 dígitos"),
});

const PhoneLogin = () => {
  const navigate = useNavigate();

  const generateRecaptcha = () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {},
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const sendSMS = (phone, recaptchaVerifier) => {
    signInWithPhoneNumber(auth, `+57${phone}`, recaptchaVerifier)
      .then((response) => {
        window.confirmationResult = response;
        console.log(response);
        Swal.fire(
          "Excelente",
          `Te enviaremos un mensaje para confirmar a ${phone}`,
          "success"
        ).then(() => navigate(`/verificationCode/+57${phone}`));
      })
      .catch((error) => {
        console.error(error);
        Swal.fire(
          "Oops!",
          `Ocurrió un error al realizar tu solicitud ${error.message}`,
          "error"
        );
      });
  };

  return (
    <main>
      <h1>Iniciar sesión con tu número celular</h1>
      <Formik
        initialValues={{
          phone: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          generateRecaptcha();
          const appVerifier = window.recaptchaVerifier;
          sendSMS(values.phone, appVerifier);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="phone">Número celular:</label>
            <Field
              type="number"
              name="phone"
              id="phone"
              placeholder="Ingrese su número celular"
            />
            <ErrorMessage name="phone" />
            <button type="submit" disabled={isSubmitting}>
              Enviar SMS
            </button>
          </Form>
        )}
      </Formik>
      <div id="recaptcha-container"></div>
    </main>
  );
};

export default PhoneLogin;
