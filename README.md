# CLASE MARTES SEPT 03/2024
--------
1. Socializarles a qué se debía la inconsistencia: En el store, operación se completaba con éxito aunque la petición generaba error.
2. Ejercicio de implementación de Firebase servicio de autenticación:
	- Registro de usuarios con email y contraseña 
	- Inicio de sesión con email y contraseña
	- Inicio de sesión con google
	- Inicio de sesión con telefono (envío de código de verificación SMS)
	- Cómo realizar el despliegue con Firebase Hosting

- Comenzar un nuevo proyecto react con vite:

```bash
  npm create vite@latest my-findy-app -- --template react
```
- abrimos la carpeta del proyecto en VSCode e instalamos dependencias con:
  ```bash
  npm install
  ```
- Instalar librerías:
	- Redux toolkit
	- react-redux
	- React router dom
	- React icons
   ```bash
	npm install @reduxjs/toolkit react-redux react-router-dom react-icons
   ```
-Eliminar los archivos de la template que no necesitamos
- Organizar la estructura de carpetas inicial del proyecto
```
└── 📁src
    └── 📁components
    └── 📁Firebase
        └── firebaseConfig.js
    └── 📁pages
        └── 📁Feed
            └── Feed.jsx
        └── 📁Login
            └── Login.jsx
        └── 📁PostDetails
            └── PostDetails.jsx
        └── 📁Profile
            └── Profile.jsx
        └── 📁Register
            └── Register.jsx
    └── 📁redux o store
    └── 📁router
        └── AppRouter.jsx
        └── PriveRoutes.jsx
        └── PublicRoutes.jsx
    └── 📁services
    └── main.jsx
```

- En el archivo `main.jsx` se instancia el componente `<AppRouter/>`

*****************
###  CREAR Y CONFIGURAR EL PROYECTO DESDE LA CONSOLA DE FIREBASE
- Ir a la consola de firebase: https://firebase.google.com/?hl=es
- Click en crear un proyecto 
- Darle nombre al proyecto
- Deshabilitar Google Analitycs y crear proyecto
- Cuando se cree el proyecto en firebase, se debe dar click en la opción web `(</>)`
- Registrar App y seguir el paso a paso que nos proporciona firebase
	- Instalar firebase:
  ```Bash
   npm install firebase
  ```
	- Copiar el código de inicialización de firebase en el proyecto
	- Pegar el código en el archivo `firebaseConfig.js`
	- Click en ir a consola
- Activar el servicio de autenticación de Firebase: Click a la card Authentication
- Click en comenzar
- Escoger el primer método de acceso: Correo y contraseña
 - Habilitar el método de acceso y se Guarda

**************
###  CONFIGURAR E INTEGRAR EL SERVICIO DE AUTH EN EL PROYECTO 

- En `firebaseConfig.js` inicializamos el servicio de auth con el método `getAuth` que viene de `firebase/auth`

*************
### CONFIGURAR REDUX TOOLKIT EN NUESTRO PROYECTO 

- Ir a la carpeta `redux/` o `store/`
- crear el archivo `store.js`
- crear la carpeta donde se guardarán los archivos relacionados al slice
```
└── 📁src
    └── 📁components
    └── 📁Firebase
        └── firebaseConfig.js
    └── 📁pages
        └── 📁Feed
            └── Feed.jsx
        └── 📁Login
            └── Login.jsx
        └── 📁PostDetails
            └── PostDetails.jsx
        └── 📁Profile
            └── Profile.jsx
        └── 📁Register
            └── Register.jsx
    └── 📁redux o store
        └── 📁auth
            └── authSlice.js
        └── store.js
    └── 📁router
        └── AppRouter.jsx
        └── PriveRoutes.jsx
        └── PublicRoutes.jsx
    └── 📁services
    └── main.jsx
```

- Configurar el store con el método `configureStore` de redux toolkit:
```javascript
import { configureStore } from "@reduxjs/toolkit";


const store = configureStore({
    reducer: {
        
    }
})

export default store;
```
- En `authSlice.js`, creamos los thunks con `createAsyncThunk` y el slice

```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/firebaseConfig";

export const createAccountThunk = createAsyncThunk("auth/createAccount", async ({ email, password, name, photo }) => {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo
    })
    return {
        id: userCredentials.user.uid,
        displayName: name,
        email: email,
        accessToken: userCredentials.user.accessToken,
        photoURL: photo
    }
});



const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createAccountThunk.pending, (state) => {
            state.loading = true;
            state.error = null
        }).addCase(createAccountThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null
        }).addCase(createAccountThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message
        })
    }
})

const authReducer = authSlice.reducer;
export default authReducer;
```
- Incluimos el slice en los reducers del store
```javascript
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";


const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

export default store;
```

- Integrar redux en la aplicación en `main.jsx`
```javascript
import { createRoot } from "react-dom/client";
import AppRouter from "./router/AppRouter";
import { Provider } from "react-redux";
import store from "./redux/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
```

- Para el jueves continuamos con el acceso de los estados globales guardados en el store desde los componentes
# CLASE JUEVES SEPT 05/2024
## EN LOS COMPONENTES
- Definir las rutas de las páginas (Sin implementar aún protección de rutas) en `AppRouter.jsx`
 - Crear el componente Layout:

1. Incluirlo en la estructura de carpetas del proyecto dentro de `components/`:  Creamos el archivo y el componente `Layout.jsx`
```
└── 📁src
    └── 📁components
        └── 📁Layout
            └── Layout.jsx
    └── 📁Firebase
        └── firebaseConfig.js
    └── 📁pages
        └── 📁Feed
            └── Feed.jsx
        └── 📁Login
            └── Login.jsx
        └── 📁PostDetails
            └── PostDetails.jsx
        └── 📁Profile
            └── Profile.jsx
        └── 📁Register
            └── Register.jsx
    └── 📁redux
        └── 📁auth
            └── authSlice.js
        └── store.js
    └── 📁router
        └── AppRouter.jsx
        └── PriveRoutes.jsx
        └── PublicRoutes.jsx
    └── 📁services
    └── main.jsx
```

2. En el componente Layout.jsx
```javascript
import { Outlet } from "react-router-dom"


const Layout = () => {
  return (
      <div>Layout
          <Outlet/>
    </div>
  )
}

export default Layout
```
 3. Definir las rutas en el componente `<AppRouter/>`
```javascript
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Feed from "../pages/Feed/Feed";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import PostDetails from "../pages/PostDetails/PostDetails";
import Profile from "../pages/Profile/Profile";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Feed />} />
          <Route path="post/:postId" element={<PostDetails />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to={'/' } /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

```
- Instalar formik y yup para trabajar con formularios en el componente `Register.jsx`:
```Bash
npm install formik yup --save
```
- Construir el componente de Registro
	- ¿Qué es lo que queremos mostrar en el componente?
	- ¿Cómo queremos mostrarlo? (Estilizado y aplicación de diseño)
	- Las funcionalidades que debe tener cada elemento que conforman el componente.
- Para manejar el archivo que se recibe en el input tipo `file` del formulario, se debe subir esa foto de perfil en el servidor de cloudinary
  
	CONFIGURACION DE CLOUDINARY
	- Ir a la página de cloudinary: [https://cloudinary.com/](https://cloudinary.com/)
	- Iniciamos sesión
	- ir al dashboard
	- asegurar el cloud name (copiarlo)
	- Ir a settings
	- Ir a la opción Upload
	- Ir a upload preset
	- dar clik a add upload preset
	- Asignar un nombre al preset y copiarlo
	- En el signing mode, le asignamos la opción unsiged
	- Le asigamos un nombre al folder donde se guardarían los archivos cargados desde el proyecto
	- Click en Save
   
	CREAR EL SERVICIO O LA FUNCION DESDE EL PROYECTO QUE NOS PERMITIRÁ CARGAR LOS ARCHIVOS A CLOUDINARY
	- Crear el archivo `uploadFiles.js` en `services/`
```
	└── 📁src
	    └── 📁components
	        └── 📁Layout
	            └── Layout.jsx
	    └── 📁Firebase
	        └── firebaseConfig.js
	    └── 📁pages
	        └── 📁Feed
	            └── Feed.jsx
	        └── 📁Login
	            └── Login.jsx
	        └── 📁PostDetails
	            └── PostDetails.jsx
	        └── 📁Profile
	            └── Profile.jsx
	        └── 📁Register
	            └── Register.jsx
	    └── 📁redux
	        └── 📁auth
	            └── authSlice.js
	        └── store.js
	    └── 📁router
	        └── AppRouter.jsx
	        └── PriveRoutes.jsx
	        └── PublicRoutes.jsx
	    └── 📁services
	        └── uploadFiles.js
	    └── main.jsx
```

- En `uploadFiles.js` colocar el siguiente código:

```javascript
const uploadFiles = async (file) => {
  const cloudName = "";		//Colocar el cloudName de su cuenta
  const uploadPreset = "";	//Colocar el preset que se creó en cloudinary para el proyecto

  const urlCloudinary = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  try {
    const resp = await fetch(urlCloudinary, {
      method: "post",
      body: formData,
    });

    if (!resp.ok) return null;

    const data = await resp.json();
    return data.secure_url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default uploadFiles;
```

- Colocar el cloudName de su cuenta en la constante `cloudName`
- Colocar el preset que se creó en cloudinary para el proyecto en la constante `uploadPreset`

- En la función que recibe el atributo `onSubmit` del componente ` Formik` que se encuentra `Register.jsx`, se ejecuta la función que nos permite cargar una imagen. Dentro de esta función, se valida si se ha ejecutado con éxito la operación de carga de imagen, si se carga con éxito, se actualiza la propiedad `photo` dentro del objeto `values` (los datos que se recogen del formulario). De lo contrario, aparece un sweetalert con el mensaje del error. Antes de esto, se debe instalar la librería:

```Bash
npm install sweetalert2
```
## En `Register.jsx`
- Disparar la acción asíncrona que permite crear una nueva cuenta en Firebase Auth
- Accedemos al store o state para tomar los datos del slice `auth` y poder mostrar los errores o la información de sesión iniciada con éxito desde el componente `Register.jsx`

- Para mostrar los errores desde `Register.jsx`
	- Crear una acción en el slice `authSlice` para limpiar los errores en `authSlice.js`
```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/firebaseConfig";

export const createAccountThunk = createAsyncThunk(
  "auth/createAccount",
  async ({ email, password, name, photo }) => {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
    return {
      id: userCredentials.user.uid,
      displayName: name,
      email: email,
      accessToken: userCredentials.user.accessToken,
      photoURL: photo,
    };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(createAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

const authReducer = authSlice.reducer;
export default authReducer;

export const { clearError } = authSlice.actions;

```
- Validamos si existe un error desde componente `Register.jsx`
	
```javascript
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Swal from "sweetalert2";
import uploadFiles from "../../services/uploadFiles";
import { useDispatch, useSelector } from "react-redux";
import { clearError, createAccountThunk } from "../../redux/auth/authSlice";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres")
    .required("El nombre es obligatorio"),
  email: Yup.string()
    .email("Ingrese un correo electrónico válido")
    .required("El correo electrónico es obligatorio"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
    .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .matches(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial")
    .required("La contraseña es obligatoria"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Debe confirmar la contraseña"),
  photo: Yup.mixed()
    .test("fileSize", "El archivo no debe exceder los 2MB", (value) => {
      if (!value) return true; // Permitir que no se seleccione ningún archivo
      return value && value.size <= 2 * 1024 * 1024;
    })
    .required("Debes seleccionar una foto de perfil"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { error, isAuthenticated, user } = useSelector((store) => store.auth);

  if (error) {
        Swal.fire({
          title: "Oops!",
          text: "¡Ha ocurrido un error en la creación de tu cuenta!",
          icon: "error",
        }).then(()=>dispatch(clearError()))
  }

  if (isAuthenticated) {
    Swal.fire({
      title: `¡Excelente, ${user?.displayName}!`,
      text: "¡Has creado exitosamente tu cuenta!",
      icon: "success",
    }).then(() => navigate("/"));
  }

  return (
    <main>
      <h1>Crear una cuenta</h1>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          repeatPassword: "",
          photo: undefined,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const profileImage = await uploadFiles(values.photo);
          if (profileImage) {
            values.photo = profileImage;
            dispatch(createAccountThunk(values));

          } else {
            Swal.fire({
              title: "Oops!",
              text: "¡Ha ocurrido un error en la carga de tu imagen de perfil! Intenta nuevamente.",
              icon: "error",
            });
          }

          setSubmitting(false);
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <label htmlFor="name">Nombre completo</label>
            <Field name="name" id="name" placeholder="Whitney" type="text" />
            <ErrorMessage name="name" />

            <label htmlFor="email">Correo electrónico:</label>
            <Field
              name="email"
              id="email"
              type="email"
              placeholder="ejemplo@email.com"
            />
            <ErrorMessage name="email" />

            <label htmlFor="password">Contraseña:</label>
            <Field
              name="password"
              id="password"
              type="password"
              placeholder="xxxxxx"
            />
            <ErrorMessage name="password" />

            <label htmlFor="repeatPassword">Confirmar contraseña:</label>
            <Field
              name="repeatPassword"
              id="repeatPassword"
              type="password"
              placeholder="xxxxxx"
            />
            <ErrorMessage name="repeatPassword" />

            <label htmlFor="photo">Escoja una foto de perfil</label>
            <Field name="photo">
              {() => (
                <input
                  type="file"
                  id="photo"
                  onChange={(event) => {
                    setFieldValue("photo", event.currentTarget.files[0]);
                  }}
                />
              )}
            </Field>
            <ErrorMessage name="photo" />

            <button disabled={isSubmitting} type="submit">
              Crear cuenta
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Si ya tiene una cuenta, por favor dar click{" "}
        <Link to={"/login"}>aqui!</Link>
      </p>
    </main>
  );
};

export default Register;

```
# CLASE VIERNES SEPT 06/2024
## Inicio de sesión con email/contraseña
 1. Crear el Thunk: Permitirá iniciar la sesión desde Firebase y alimentar el store

```javascript
export const loginWithEmailAndPassworThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return {
      id: user.uid,
      displayName: user.displayName,
      email: email,
      accessToken: user.accessToken,
      photoURL: user.photoURL,
    };
  }
);
```
 2. Incluir los `extraReducers` en el `authSlice`

```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../Firebase/firebaseConfig";

export const createAccountThunk = createAsyncThunk(
  "auth/createAccount",
  async ({ email, password, name, photo }) => {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
    return {
      id: userCredentials.user.uid,
      displayName: name,
      email: email,
      accessToken: userCredentials.user.accessToken,
      photoURL: photo,
    };
  }
);

export const loginWithEmailAndPassworThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return {
      id: user.uid,
      displayName: user.displayName,
      email: email,
      accessToken: user.accessToken,
      photoURL: user.photoURL,
    };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(createAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }).addCase(loginWithEmailAndPassworThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(loginWithEmailAndPassworThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      }).addCase(loginWithEmailAndPassworThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

const authReducer = authSlice.reducer;
export default authReducer;

export const { clearError } = authSlice.actions;
```
 3. Construir el componente Login, en este componente nos vamos a disparar el thunk y accederemos a la información que se encuentra en el store.

```javascript
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  clearError,
  loginWithEmailAndPassworThunk,
} from "../../redux/auth/authSlice";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Ingrese un correo electrónico válido")
    .required("El correo electrónico es obligatorio"),
  password: Yup.string().required("La contraseña es obligatoria"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isAuthenticated, user } = useSelector((store) => store.auth);

  if (error) {
    Swal.fire({
      title: "Oops!",
      text: "¡Ha ocurrido un error en el inicio de sesión! Verifique sus credenciales",
      icon: "error",
    }).then(() => dispatch(clearError()));
  }

  if (isAuthenticated) {
    Swal.fire({
      title: "¡Has iniciado sesión exitosamente!",
      text: `¡Te damos la bienvenida, ${user?.displayName}!`,
      icon: "success",
    }).then(() => navigate("/"));
  }

  return (
    <main>
      <h1>Iniciar Sesión</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(loginWithEmailAndPassworThunk(values));
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="email">Correo electrónico:</label>
            <Field
              type="email"
              name="email"
              id="email"
              placeholder="ejemplo@email.com"
            />
            <ErrorMessage name="email" />

            <label htmlFor="password">Contraseña:</label>
            <Field
              type="password"
              name="password"
              id="password"
              placeholder="Ingrese su contraseña"
            />
            <ErrorMessage name="password" />

            <button type="submit" disabled={isSubmitting}>
              Iniciar sesión
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Si aún no tiene una cuenta, por favor dar click{" "}
        <Link to={"/register"}>aquí!</Link>
      </p>
      <section>
        <span>o, también puedes iniciar sesión con:</span>
        <div>
          <button>Iniciar sesión con google</button>
          <button>Iniciar sesión con teléfono</button>
        </div>
      </section>
    </main>
  );
};

export default Login;
```
## Cierre de sesión
1. Creamos en `authSlice.js` el thunk `logoutThunk`
2. Agregamos los casos en la propiedad `extraReducers` del objeto que recibe el slice para cuando la operación se ejecute con éxito o sea rechazada.

```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../Firebase/firebaseConfig";

export const createAccountThunk = createAsyncThunk(
  "auth/createAccount",
  async ({ email, password, name, photo }) => {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
    return {
      id: userCredentials.user.uid,
      displayName: name,
      email: email,
      accessToken: userCredentials.user.accessToken,
      photoURL: photo,
    };
  }
);

export const loginWithEmailAndPassworThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return {
      id: user.uid,
      displayName: user.displayName,
      email: email,
      accessToken: user.accessToken,
      photoURL: user.photoURL,
    };
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(createAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginWithEmailAndPassworThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmailAndPassworThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginWithEmailAndPassworThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        (state.loading = false), (state.error = action.error.message);
      });
  },
});

const authReducer = authSlice.reducer;
export default authReducer;

export const { clearError } = authSlice.actions;

```

2. En el componente `Layout.jsx`, agregamos un botón de cierre de sesión.
3. En el onClick del botón disparamos el thunk

```javascript
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { logoutThunk } from "../../redux/auth/authSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector(store=>store.auth)

  const handleLogout = () => dispatch(logoutThunk());

  return (
    <div>
      {isAuthenticated && <button onClick={handleLogout}>Cerrar sesión</button>}
      Layout
      <Outlet />
    </div>
  );
};

export default Layout;

```
## Inicio de sesión con Google
1. Activar el proveedor de acceso desde la consola de firebase.
2. Crear el thunk que permitirá el inicio de sesión con google a través de firebase auth y posteriormente actualizar el store.
3. Agregar los casos en la propiedad `extraReducers` para los estados: `pending`, `fulfilled`, `rejected`
```javascript
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../Firebase/firebaseConfig";

export const createAccountThunk = createAsyncThunk(
  "auth/createAccount",
  async ({ email, password, name, photo }) => {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
    return {
      id: userCredentials.user.uid,
      displayName: name,
      email: email,
      accessToken: userCredentials.user.accessToken,
      photoURL: photo,
    };
  }
);

export const loginWithEmailAndPassworThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return {
      id: user.uid,
      displayName: user.displayName,
      email: email,
      accessToken: user.accessToken,
      photoURL: user.photoURL,
    };
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
  return null;
});

export const googleLoginThunk = createAsyncThunk(
  "auth/googleLogin",
  async () => {
    const googleProvider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, googleProvider);
    return {
      id: user.uid,
      displayName: user.displayName,
      accessToken: user.accessToken,
      photoURL: user.photoURL,
      email: user.email,
    };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(createAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginWithEmailAndPassworThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmailAndPassworThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginWithEmailAndPassworThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        (state.loading = false), (state.error = action.error.message);
      })
      .addCase(googleLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(googleLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

const authReducer = authSlice.reducer;
export default authReducer;

export const { clearError } = authSlice.actions;

```
4. Desde el componente `Login.jsx` disparar la acción asíncrona (thunk) en el onClick del botón inicio de sesión con google

```javascript
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  clearError,
  googleLoginThunk,
  loginWithEmailAndPassworThunk,
} from "../../redux/auth/authSlice";
import Swal from "sweetalert2";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Ingrese un correo electrónico válido")
    .required("El correo electrónico es obligatorio"),
  password: Yup.string().required("La contraseña es obligatoria"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isAuthenticated, user } = useSelector((store) => store.auth);

  const handleGoogleLogin = () => {
    dispatch(googleLoginThunk())
  }

  if (error) {
    Swal.fire({
      title: "Oops!",
      text: "¡Ha ocurrido un error en el inicio de sesión! Verifique sus credenciales",
      icon: "error",
    }).then(() => dispatch(clearError()));
  }

  if (isAuthenticated) {
    Swal.fire({
      title: "¡Has iniciado sesión exitosamente!",
      text: `¡Te damos la bienvenida, ${user?.displayName}!`,
      icon: "success",
    }).then(() => navigate("/"));
  }

  return (
    <main>
      <h1>Iniciar Sesión</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(loginWithEmailAndPassworThunk(values));
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="email">Correo electrónico:</label>
            <Field
              type="email"
              name="email"
              id="email"
              placeholder="ejemplo@email.com"
            />
            <ErrorMessage name="email" />

            <label htmlFor="password">Contraseña:</label>
            <Field
              type="password"
              name="password"
              id="password"
              placeholder="Ingrese su contraseña"
            />
            <ErrorMessage name="password" />

            <button type="submit" disabled={isSubmitting}>
              Iniciar sesión
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Si aún no tiene una cuenta, por favor dar click{" "}
        <Link to={"/register"}>aquí!</Link>
      </p>
      <section>
        <span>o, también puedes iniciar sesión con:</span>
        <div>
          <button onClick={handleGoogleLogin}>Iniciar sesión con google</button>
          <button>Iniciar sesión con teléfono</button>
        </div>
      </section>
    </main>
  );
};

export default Login;
```
## Inicio de sesión con número celular
1. Activar el proveedor de acceso desde la consola de firebase
2. Construimos el componente donde el usuario va a ingresar el número telefónico y donde se ejecutará la función de enviar SMS
	- En la estructura de carpetas
		```
		└── 📁src
		    └── 📁components
		        └── 📁Layout
		            └── Layout.jsx
		    └── 📁Firebase
		        └── firebaseConfig.js
		    └── 📁pages
		        └── 📁Feed
		            └── Feed.jsx
		        └── 📁Login
		            └── Login.jsx
		        └── 📁PhoneLogin
		            └── PhoneLogin.jsx
		        └── 📁PostDetails
		            └── PostDetails.jsx
		        └── 📁Profile
		            └── Profile.jsx
		        └── 📁Register
		            └── Register.jsx
		    └── 📁redux
		        └── 📁auth
		            └── authSlice.js
		        └── store.js
		    └── 📁router
		        └── AppRouter.jsx
		        └── PriveRoutes.jsx
		        └── PublicRoutes.jsx
		    └── 📁services
		        └── uploadFiles.js
		    └── main.jsx
		```
	- Definir la ruta para la página de inicio de sesión por número celular:
  
		```javascript
		import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
		import Layout from "../components/Layout/Layout";
		import Feed from "../pages/Feed/Feed";
		import Register from "../pages/Register/Register";
		import Login from "../pages/Login/Login";
		import PostDetails from "../pages/PostDetails/PostDetails";
		import Profile from "../pages/Profile/Profile";
		import PhoneLogin from "../pages/PhoneLogin/PhoneLogin";
		
		const AppRouter = () => {
		  return (
		    <BrowserRouter>
		      <Routes>
		        <Route path="/" element={<Layout />}>
		          <Route index element={<Feed />} />
		          <Route path="post/:postId" element={<PostDetails />} />
		          <Route path="profile/:userId" element={<Profile />} />
		          <Route path="register" element={<Register />} />
		          <Route path="login" element={<Login />} />
		          <Route path="phoneLogin" element={<PhoneLogin/> } />
		          <Route path="*" element={<Navigate to={'/' } /> } />
		        </Route>
		      </Routes>
		    </BrowserRouter>
		  );
		};
		
		export default AppRouter;
		```

	- En el componente `Login.jsx`, le colocamos el evento onClik al botón de inicio de sesión por número celular. Ese botón solamente va a navegar hacia la página de inicio de sesión con teléfono

		```javascript
		import { ErrorMessage, Field, Form, Formik } from "formik";
		import { useDispatch, useSelector } from "react-redux";
		import { Link, useNavigate } from "react-router-dom";
		import * as Yup from "yup";
		import {
		  clearError,
		  googleLoginThunk,
		  loginWithEmailAndPassworThunk,
		} from "../../redux/auth/authSlice";
		import Swal from "sweetalert2";
		
		const validationSchema = Yup.object().shape({
		  email: Yup.string()
		    .email("Ingrese un correo electrónico válido")
		    .required("El correo electrónico es obligatorio"),
		  password: Yup.string().required("La contraseña es obligatoria"),
		});
		
		const Login = () => {
		  const navigate = useNavigate();
		  const dispatch = useDispatch();
		  const { error, isAuthenticated, user } = useSelector((store) => store.auth);
		
		  const handleGoogleLogin = () => {
		    dispatch(googleLoginThunk());
		  };
		
		  const handleNavigatePhoneLogin = () => navigate("/phoneLogin");
		
		  if (error) {
		    Swal.fire({
		      title: "Oops!",
		      text: "¡Ha ocurrido un error en el inicio de sesión! Verifique sus credenciales",
		      icon: "error",
		    }).then(() => dispatch(clearError()));
		  }
		
		  if (isAuthenticated) {
		    Swal.fire({
		      title: "¡Has iniciado sesión exitosamente!",
		      text: `¡Te damos la bienvenida, ${user?.displayName}!`,
		      icon: "success",
		    }).then(() => navigate("/"));
		  }
		
		  return (
		    <main>
		      <h1>Iniciar Sesión</h1>
		      <Formik
		        initialValues={{
		          email: "",
		          password: "",
		        }}
		        validationSchema={validationSchema}
		        onSubmit={(values, { setSubmitting }) => {
		          dispatch(loginWithEmailAndPassworThunk(values));
		          setSubmitting(false);
		        }}
		      >
		        {({ isSubmitting }) => (
		          <Form>
		            <label htmlFor="email">Correo electrónico:</label>
		            <Field
		              type="email"
		              name="email"
		              id="email"
		              placeholder="ejemplo@email.com"
		            />
		            <ErrorMessage name="email" />
		
		            <label htmlFor="password">Contraseña:</label>
		            <Field
		              type="password"
		              name="password"
		              id="password"
		              placeholder="Ingrese su contraseña"
		            />
		            <ErrorMessage name="password" />
		
		            <button type="submit" disabled={isSubmitting}>
		              Iniciar sesión
		            </button>
		          </Form>
		        )}
		      </Formik>
		      <p>
		        Si aún no tiene una cuenta, por favor dar click{" "}
		        <Link to={"/register"}>aquí!</Link>
		      </p>
		      <section>
		        <span>o, también puedes iniciar sesión con:</span>
		        <div>
		          <button onClick={handleGoogleLogin}>Iniciar sesión con google</button>
		          <button onClick={handleNavigatePhoneLogin}>
		            Iniciar sesión con teléfono
		          </button>
		        </div>
		      </section>
		    </main>
		  );
		};
		
		export default Login;
		
		```

	- Construir el componente `PhoneLogin.jsx` y las funciones necesarias para enviar el SMS con el código de verificación

		```javascript
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
		
		
		```
3. Creamos el thunk que validará el código en `authSlice.js`
4. Agregamos los casos en el extrareducers
	```javascript
	
	import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
	import {
	  createUserWithEmailAndPassword,
	  GoogleAuthProvider,
	  signInWithEmailAndPassword,
	  signInWithPopup,
	  signOut,
	  updateProfile,
	} from "firebase/auth";
	import { auth } from "../../Firebase/firebaseConfig";
	
	export const createAccountThunk = createAsyncThunk(
	  "auth/createAccount",
	  async ({ email, password, name, photo }) => {
	    const userCredentials = await createUserWithEmailAndPassword(
	      auth,
	      email,
	      password
	    );
	    await updateProfile(auth.currentUser, {
	      displayName: name,
	      photoURL: photo,
	    });
	    return {
	      id: userCredentials.user.uid,
	      displayName: name,
	      email: email,
	      accessToken: userCredentials.user.accessToken,
	      photoURL: photo,
	    };
	  }
	);
	
	export const loginWithEmailAndPassworThunk = createAsyncThunk(
	  "auth/login",
	  async ({ email, password }) => {
	    const { user } = await signInWithEmailAndPassword(auth, email, password);
	    return {
	      id: user.uid,
	      displayName: user.displayName,
	      email: email,
	      accessToken: user.accessToken,
	      photoURL: user.photoURL,
	    };
	  }
	);
	
	export const logoutThunk = createAsyncThunk("auth/logout", async () => {
	  await signOut(auth);
	  return null;
	});
	
	export const googleLoginThunk = createAsyncThunk(
	  "auth/googleLogin",
	  async () => {
	    const googleProvider = new GoogleAuthProvider();
	    const { user } = await signInWithPopup(auth, googleProvider);
	    return {
	      id: user.uid,
	      displayName: user.displayName,
	      accessToken: user.accessToken,
	      photoURL: user.photoURL,
	      email: user.email,
	    };
	  }
	);
	
	export const loginWithVerificationCodeThunk = createAsyncThunk(
	  "auth/loginWithVerificationCode",
	  async (code, { rejectWithValue }) => {
	    try {
	      const confirmationResult = window.confirmationResult;
	      if (!confirmationResult) {
	        throw new Error("No hay resultado de confirmación disponible");
	      }
	      const { user } = await confirmationResult.confirm(code);
	
	      return {
	        id: user.uid,
	        displayName: user.displayName,
	        photoURL: user.photoURL,
	        phoneNumber: user.phoneNumber,
	        accessToken: user.accessToken,
	      };
	    } catch (error) {
	      return rejectWithValue(error.message || "Error en la verificación");
	    }
	  }
	);
	
	const authSlice = createSlice({
	  name: "auth",
	  initialState: {
	    isAuthenticated: false,
	    user: null,
	    loading: false,
	    error: null,
	  },
	  reducers: {
	    clearError: (state) => {
	      state.error = null;
	    },
	  },
	  extraReducers: (builder) => {
	    builder
	      .addCase(createAccountThunk.pending, (state) => {
	        state.loading = true;
	        state.error = null;
	      })
	      .addCase(createAccountThunk.fulfilled, (state, action) => {
	        state.loading = false;
	        state.isAuthenticated = true;
	        state.user = action.payload;
	        state.error = null;
	      })
	      .addCase(createAccountThunk.rejected, (state, action) => {
	        state.loading = false;
	        state.error = action.error.message;
	      })
	      .addCase(loginWithEmailAndPassworThunk.pending, (state) => {
	        state.loading = true;
	        state.error = null;
	      })
	      .addCase(loginWithEmailAndPassworThunk.fulfilled, (state, action) => {
	        state.loading = false;
	        state.isAuthenticated = true;
	        state.user = action.payload;
	        state.error = null;
	      })
	      .addCase(loginWithEmailAndPassworThunk.rejected, (state, action) => {
	        state.loading = false;
	        state.error = action.error.message;
	      })
	      .addCase(logoutThunk.fulfilled, (state, action) => {
	        state.loading = false;
	        state.isAuthenticated = false;
	        state.user = action.payload;
	        state.error = null;
	      })
	      .addCase(logoutThunk.rejected, (state, action) => {
	        (state.loading = false), (state.error = action.error.message);
	      })
	      .addCase(googleLoginThunk.pending, (state) => {
	        state.loading = true;
	        state.error = null;
	      })
	      .addCase(googleLoginThunk.fulfilled, (state, action) => {
	        state.loading = false;
	        state.isAuthenticated = true;
	        state.user = action.payload;
	        state.error = null;
	      })
	      .addCase(googleLoginThunk.rejected, (state, action) => {
	        state.loading = false;
	        state.error = action.error.message;
	      }).addCase(loginWithVerificationCodeThunk.pending, (state) => {
	        state.loading = true;
	        state.error = null;
	      }).addCase(loginWithVerificationCodeThunk.fulfilled, (state, action) => {
	        state.loading = false;
	        state.isAuthenticated = true;
	        state.user = action.payload;
	        state.error = null;
	      }).addCase(loginWithVerificationCodeThunk.rejected, (state, action) => {
	        state.loading = false;
	        state.error = action.payload;
	      })
	  },
	});
	
	const authReducer = authSlice.reducer;
	export default authReducer;
	
	export const { clearError } = authSlice.actions;
	
	```
5. Construimos el componente donde el usuario ingresará el código y se disparará el thunk de verificación de código.
	- En la estructura de carpetas:
	```
	└── 📁src
	    └── 📁components
	        └── 📁Layout
	            └── Layout.jsx
	    └── 📁Firebase
	        └── firebaseConfig.js
	    └── 📁pages
	        └── 📁Feed
	            └── Feed.jsx
	        └── 📁Login
	            └── Login.jsx
	        └── 📁PhoneLogin
	            └── PhoneLogin.jsx
	        └── 📁PostDetails
	            └── PostDetails.jsx
	        └── 📁Profile
	            └── Profile.jsx
	        └── 📁Register
	            └── Register.jsx
	        └── 📁VerificationCode
	            └── VerificationCode.jsx
	    └── 📁redux
	        └── 📁auth
	            └── authSlice.js
	        └── store.js
	    └── 📁router
	        └── AppRouter.jsx
	        └── PrivateRoutes.jsx
	        └── PublicRoutes.jsx
	    └── 📁services
	        └── uploadFiles.js
	    └── main.jsx
	```
	- En la definición de las rutas:
	```javascript
	import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
	import Layout from "../components/Layout/Layout";
	import Feed from "../pages/Feed/Feed";
	import Register from "../pages/Register/Register";
	import Login from "../pages/Login/Login";
	import PostDetails from "../pages/PostDetails/PostDetails";
	import Profile from "../pages/Profile/Profile";
	import PhoneLogin from "../pages/PhoneLogin/PhoneLogin";
	import VerificationCode from "../pages/VerificationCode/VerificationCode";
	
	const AppRouter = () => {
	  return (
	    <BrowserRouter>
	      <Routes>
	        <Route path="/" element={<Layout />}>
	          <Route index element={<Feed />} />
	          <Route path="post/:postId" element={<PostDetails />} />
	          <Route path="profile/:userId" element={<Profile />} />
	          <Route path="register" element={<Register />} />
	          <Route path="login" element={<Login />} />
	          <Route path="phoneLogin" element={<PhoneLogin/> } />
		  <Route path="verificationCode/:phoneNumber" element={<VerificationCode />} />
	          <Route path="*" element={<Navigate to={'/' } /> } />
	        </Route>
	      </Routes>
	    </BrowserRouter>
	  );
	};
	
	export default AppRouter;
	```
	- En el mismo componente `VerificationCode.jsx`

	```javascript
	import { ErrorMessage, Field, Form, Formik } from "formik";
	import { useDispatch, useSelector } from "react-redux";
	import * as Yup from "yup";
	import {
	  clearError,
	  loginWithVerificationCodeThunk,
	} from "../../redux/auth/authSlice";
	import Swal from "sweetalert2";
	import { useNavigate } from "react-router-dom";
	
	const VerificationCode = () => {
	  const navigate = useNavigate();
	  const dispatch = useDispatch();
	  const { error, isAuthenticated, user } = useSelector((store) => store.auth);
	
	  if (error) {
	    Swal.fire({
	      title: "Oops!",
	      text: "¡Ha ocurrido un error en el inicio de sesión! Intente nuevamente",
	      icon: "error",
	    }).then(() => dispatch(clearError()));
	  }
	  if (isAuthenticated) {
	    Swal.fire({
	      title: "¡Has iniciado sesión exitosamente!",
	      text: user?.displayName
	        ? `¡Te damos la bienvenida, ${user?.displayName}!`
	        : "¡Te damos la bienvenida!",
	      icon: "success",
	    }).then(() => navigate("/"));
	  }
	  return (
	    <main>
	      <h1>Ingresar código de verificación</h1>
	      <Formik
	        initialValues={{
	          code: "",
	        }}
	        validationSchema={Yup.object().shape({
	          code: Yup.string()
	            .required("Por favor ingrese un código de verificación")
	            .matches(/^[0-9]+$/, "Debe contener solo números del 0 al 9")
	            .max(6, "El código de verificación debe tener 6 dígitos")
	            .min(6, "El código de verificación debe tener 6 dígitos"),
	        })}
	        onSubmit={(values, { setSubmitting }) => {
	          dispatch(loginWithVerificationCodeThunk(values.code));
	
	          setSubmitting(false);
	        }}
	      >
	        {({ isSubmitting }) => (
	          <Form>
	            <label htmlFor="code">Código de verificación</label>
	            <Field type="number" name="code" id="code" />
	            <ErrorMessage name="code" />
	
	            <button type="submit" disabled={isSubmitting}>
	              Iniciar sesión
	            </button>
	          </Form>
	        )}
	      </Formik>
	    </main>
	  );
	};
	
	export default VerificationCode;
	```
## Implementación de observador de sesión y protección de rutas
1. En el componente `AppRouter.jsx`, utilizamos `useEffect` para ejecutar la función `onAuthStateChanged` de `firebase/auth`. Esta función va a verificar si hay o no hay una sesión activa. En el caso de que haya una sesión activa se va a disparar una acción que permite la restauranción de la información del usuario en el store.

2. Colocamos la lógica de los componentes `PrivateRoutes.jsx` y `PublicRoutes.jsx` para manejar la protección de rutas.

3. Desde `AppRouter.jsx`, definimos las rutas privadas y públicas.

	- Código de `AppRouter.jsx`
		```javascript
		import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
		import Layout from "../components/Layout/Layout";
		import Feed from "../pages/Feed/Feed";
		import Register from "../pages/Register/Register";
		import Login from "../pages/Login/Login";
		import PostDetails from "../pages/PostDetails/PostDetails";
		import Profile from "../pages/Profile/Profile";
		import PhoneLogin from "../pages/PhoneLogin/PhoneLogin";
		import VerificationCode from "../pages/VerificationCode/VerificationCode";
		import { useEffect, useState } from "react";
		import { onAuthStateChanged } from "firebase/auth";
		import { auth } from "../Firebase/firebaseConfig";
		import { useDispatch, useSelector } from "react-redux";
		import { restoreSession } from "../redux/auth/authSlice";
		import PrivateRoutes from "./PrivateRoutes";
		import PublicRoutes from "./PublicRoutes";
		
		const AppRouter = () => {
		  const dispatch = useDispatch();
		  const { loading, isAuthenticated } = useSelector((store) => store.auth);
		  const [checking, setChecking] = useState(true);
		
		  useEffect(() => {
		    onAuthStateChanged(auth, (authUser) => {
		      if (authUser) {
		        const loggedInUser = {
		          id: authUser.uid,
		          displayName: authUser.displayName,
		          email: authUser.email || null,
		          phoneNumber: authUser.phoneNumber || null,
		          accessToken: authUser.accessToken,
		          photoURL: authUser.photoURL,
		        };
		        dispatch(restoreSession(loggedInUser));
		      }
		      setChecking(false);
		    });
		  }, [dispatch]);
		
		  if (loading || checking) return <div>...Cargando</div>;
		
		  return (
		    <BrowserRouter>
		      <Routes>
		        <Route path="/" element={<Layout />}>
		          <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
		            <Route index element={<Feed />} />
		            <Route path="post/:postId" element={<PostDetails />} />
		            <Route path="profile/:userId" element={<Profile />} />
		          </Route>
		          <Route element={<PublicRoutes isAuthenticated={isAuthenticated} />}>
		            <Route path="register" element={<Register />} />
		            <Route path="login" element={<Login />} />
		            <Route path="phoneLogin" element={<PhoneLogin />} />
		            <Route
		              path="verificationCode/:phoneNumber"
		              element={<VerificationCode />}
		            />
		          </Route>
		
		          <Route path="*" element={<Navigate to={"/"} />} />
		        </Route>
		      </Routes>
		    </BrowserRouter>
		  );
		};
		
		export default AppRouter;
		
		```
	- `PublicRoutes.jsx`
		```javascript
		import { Navigate, Outlet } from "react-router-dom";
		import PropTypes from "prop-types";
		
		const PublicRoutes = ({ isAuthenticated, redirectPath = "/", children }) => {
		  if (isAuthenticated) {
		    return <Navigate replace to={redirectPath} />;
		  }
		  return children || <Outlet />;
		};
		
		PublicRoutes.propTypes = {
		  isAuthenticated: PropTypes.bool.isRequired,
		  redirectPath: PropTypes.string,
		  children: PropTypes.node,
		};
		
		export default PublicRoutes;
		```
	- `PrivateRoutes.jsx`
		```javascript
		import { Navigate, Outlet } from "react-router-dom";
		import PropTypes from "prop-types";
		
		const PrivateRoutes = ({
		  isAuthenticated,
		  redirectPath = "/login",
		  children,
		}) => {
		  if (!isAuthenticated) {
		    return <Navigate replace to={redirectPath} />;
		  }
		  return children || <Outlet />;
		};
		
		PrivateRoutes.propTypes = {
		  isAuthenticated: PropTypes.bool.isRequired,
		  redirectPath: PropTypes.string,
		  children: PropTypes.node,
		};
		
		export default PrivateRoutes;
		```

# CLASE LUNES SEPT 09/2024
## ¿Qué hacer si necesitamos guardar datos adicionales del usuario en nuestra aplicación?
Complementar el servicio de autenticación de Firebase con el servicio de base de datos (Firestore).
### ¿Cómo se implementa Firestore junto con Firebase Auth?
1. Activar e inicializar el servicio de firestore tanto en la consola de Firebase como en la configuración del proyecto.
	- Desde la consola de Firebase:
		1. Activar el servicio de Firestore y crear la base de datos (Si aún no se ha realizado)
     		2. Crear una colección separada `users` en Firestore para almacenar todos los datos del usuario.
	- Desde el proyecto en el archivo `firebaseConfig.js`
		1. Iniciarlizar el servicio de Firestore con el método `getFirestore` de `firebase/firestore`
		     ```javascript
			// Import the functions you need from the SDKs you need
			import { initializeApp } from "firebase/app";
			import { getAuth } from "firebase/auth";
			import { getFirestore } from "firebase/firestore";
			// TODO: Add SDKs for Firebase products that you want to use
			// https://firebase.google.com/docs/web/setup#available-libraries
			
			// Your web app's Firebase configuration
			const firebaseConfig = {
			
			};
			
			// Initialize Firebase
			const app = initializeApp(firebaseConfig);
			export const auth = getAuth(app);
			export const database = getFirestore(app)
		     ```
3. Integrar firestore en los thunks de autenticación en `authSlice.js`
	- En el thunk donde se crea una cuenta con email y contraseña
		```javascript
		const collectionName = "users";
		
		export const createAccountThunk = createAsyncThunk(
		  "auth/createAccount",
		  async ({ email, password, name, photo }) => {
		    const userCredentials = await createUserWithEmailAndPassword(
		      auth,
		      email,
		      password
		    );
		    await updateProfile(auth.currentUser, {
		      displayName: name,
		      photoURL: photo,
		    });
		
		    //Crear o guardar el usuario en la base de datos
		
		    const newUser = {
		      id: userCredentials.user.uid,
		      displayName: name,
		      email: email,
		      accessToken: userCredentials.user.accessToken,
		      photoURL: photo,
		      isAdmin: false
		      //Incluir el resto de la información (o propiedades) que necesiten guardar del usuario
		    };
		
		    //Armamos la referencia del nuevo usuario a guarda
		    const userRef = doc(database, collectionName, userCredentials.user.uid);
		    //Se guarda el usuario con la referencia que se creó en la línea anterior
		    await setDoc(userRef, newUser);
		    return newUser;
		  }
		);
		```
	- En el thunk donde se inicia sesión con email y contraseña
		```javascript
		export const loginWithEmailAndPassworThunk = createAsyncThunk(
		  "auth/login",
		  async ({ email, password }) => {
		    const { user } = await signInWithEmailAndPassword(auth, email, password);
		
		    //Obtener la información del usuario en la base de datos
		    const userRef = doc(database, collectionName, user.uid);
		    const userDoc = await getDoc(userRef);
		
		    if (userDoc.exists()) {
		      return userDoc.data()
		    } else {
		      throw new Error('No se encontraron datos del usuario')
		    }    
		  }
		);
		```
	- En el thunk donde se inicia sesión con una cuenta google
		```javascript
		export const googleLoginThunk = createAsyncThunk(
		  "auth/googleLogin",
		  async () => {
		    const googleProvider = new GoogleAuthProvider();
		    const { user } = await signInWithPopup(auth, googleProvider);
		
		    //Se busca la información del usuario en la base de datos. Si no existe el usuario se crea y si existe se obtiene la información
		    let newUser = null;
		    const userRef = doc(database, collectionName, user.uid);
		    const userDoc = await getDoc(userRef);
		
		    if (userDoc.exists()) {
		      newUser = userDoc.data();
		    } else {
		      newUser = {
		        id: user.uid,
		        displayName: user.displayName,
		        accessToken: user.accessToken,
		        photoURL: user.photoURL,
		        email: user.email,
		        isAdmin: false,
		        //Incluir el resto de la información que deben guardar
		        city: null,
		      };
		      await setDoc(userRef, newUser);
		    }
		
		    return newUser;
		  }
		);
		```
	- En el thunk donde se inicia sesión con telefono / código de verificación
		```javascript
		export const loginWithVerificationCodeThunk = createAsyncThunk(
		  "auth/loginWithVerificationCode",
		  async (code, { rejectWithValue }) => {
		    try {
		      const confirmationResult = window.confirmationResult;
		      if (!confirmationResult) {
		        throw new Error("No hay resultado de confirmación disponible");
		      }
		      const { user } = await confirmationResult.confirm(code);
		
		      //Se busca la información del usuario en la base de datos. Si no existe el usuario se crea y si existe se obtiene la información
		
		      let newUser = null;
		      const userRef = doc(database, collectionName, user.uid);
		      const userDoc = await getDoc(userRef);
		
		      if (userDoc.exists()) {
		        newUser = userDoc.data();
		      } else {
		        newUser = {
		          id: user.uid,
		          displayName: user.displayName,
		          accessToken: user.accessToken,
		          photoURL: user.photoURL,
		          email: user.email,
		          phoneNumber: user.phoneNumber,
		          isAdmin: false,
		          //Incluir el resto de la información que deben guardar
		          city: null,
		        };
		        await setDoc(userRef, newUser);
		      }
		
		      return newUser;
		    } catch (error) {
		      return rejectWithValue(error.message || "Error en la verificación");
		    }
		  }
		);
		```
5. Ajustar el estado de atenticación en el componente `AppRouter.js` en el lugar donde se está ejecutando la función `onAuthChanged` de Firebase
   	- En el archivo `authSlice.js`
		- Se crear un thunk que permita restaurar la sesión activa, es decir, recuperar los datos del usuario desde la base de datos y alimentar el store
		- Agregar los casos de cómo se actualiza el slice `auth` cuando se ejecutan los tres estados de la operación asíncrono en la propiedad `extraReducers`
			```javascript
			import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
			import {
			  createUserWithEmailAndPassword,
			  GoogleAuthProvider,
			  signInWithEmailAndPassword,
			  signInWithPopup,
			  signOut,
			  updateProfile,
			} from "firebase/auth";
			import { auth, database } from "../../Firebase/firebaseConfig";
			import { doc, getDoc, setDoc } from "firebase/firestore";
			
			const collectionName = "users";
			
			export const createAccountThunk = createAsyncThunk(
			  "auth/createAccount",
			  async ({ email, password, name, photo }) => {
			    const userCredentials = await createUserWithEmailAndPassword(
			      auth,
			      email,
			      password
			    );
			    await updateProfile(auth.currentUser, {
			      displayName: name,
			      photoURL: photo,
			    });
			
			    //Crear o guardar el usuario en la base de datos
			
			    const newUser = {
			      id: userCredentials.user.uid,
			      displayName: name,
			      email: email,
			      accessToken: userCredentials.user.accessToken,
			      photoURL: photo,
			      isAdmin: false,
			      //Incluir el resto de la información (o propiedades) que necesiten guardar del usuario
			    };
			
			    //Armamos la referencia del nuevo usuario a guarda
			    const userRef = doc(database, collectionName, userCredentials.user.uid);
			    //Se guarda el usuario con la referencia que se creó en la línea anterior
			    await setDoc(userRef, newUser);
			    return newUser;
			  }
			);
			
			export const loginWithEmailAndPassworThunk = createAsyncThunk(
			  "auth/login",
			  async ({ email, password }) => {
			    const { user } = await signInWithEmailAndPassword(auth, email, password);
			
			    //Obtener la información del usuario en la base de datos
			    const userRef = doc(database, collectionName, user.uid);
			    const userDoc = await getDoc(userRef);
			
			    if (userDoc.exists()) {
			      return userDoc.data();
			    } else {
			      throw new Error("No se encontraron datos del usuario");
			    }
			  }
			);
			
			export const logoutThunk = createAsyncThunk("auth/logout", async () => {
			  await signOut(auth);
			  return null;
			});
			
			export const googleLoginThunk = createAsyncThunk(
			  "auth/googleLogin",
			  async () => {
			    const googleProvider = new GoogleAuthProvider();
			    const { user } = await signInWithPopup(auth, googleProvider);
			
			    //Se busca la información del usuario en la base de datos. Si no existe el usuario se crea y si existe se obtiene la información
			    let newUser = null;
			    const userRef = doc(database, collectionName, user.uid);
			    const userDoc = await getDoc(userRef);
			
			    if (userDoc.exists()) {
			      newUser = userDoc.data();
			    } else {
			      newUser = {
			        id: user.uid,
			        displayName: user.displayName,
			        accessToken: user.accessToken,
			        photoURL: user.photoURL,
			        email: user.email,
			        isAdmin: false,
			        //Incluir el resto de la información que deben guardar
			        city: null,
			      };
			      await setDoc(userRef, newUser);
			    }
			
			    return newUser;
			  }
			);
			
			export const loginWithVerificationCodeThunk = createAsyncThunk(
			  "auth/loginWithVerificationCode",
			  async (code, { rejectWithValue }) => {
			    try {
			      const confirmationResult = window.confirmationResult;
			      if (!confirmationResult) {
			        throw new Error("No hay resultado de confirmación disponible");
			      }
			      const { user } = await confirmationResult.confirm(code);
			
			      //Se busca la información del usuario en la base de datos. Si no existe el usuario se crea y si existe se obtiene la información
			
			      let newUser = null;
			      const userRef = doc(database, collectionName, user.uid);
			      const userDoc = await getDoc(userRef);
			
			      if (userDoc.exists()) {
			        newUser = userDoc.data();
			      } else {
			        newUser = {
			          id: user.uid,
			          displayName: user.displayName,
			          accessToken: user.accessToken,
			          photoURL: user.photoURL,
			          email: user.email,
			          phoneNumber: user.phoneNumber,
			          isAdmin: false,
			          //Incluir el resto de la información que deben guardar
			          city: null,
			        };
			        await setDoc(userRef, newUser);
			      }
			
			      return newUser;
			    } catch (error) {
			      return rejectWithValue(error.message || "Error en la verificación");
			    }
			  }
			);
			
			export const restoreActiveSessionThunk = createAsyncThunk(
			  "auth/restoreActiveSession",
			  async (userId) => {
			    const userRef = doc(database, collectionName, userId);
			    const userDoc = await getDoc(userRef);
			    if (userDoc.exists()) {
			      return userDoc.data();
			    } else {
			      throw new Error("Usuario no encontrado");
			    }
			  }
			);
			
			const authSlice = createSlice({
			  name: "auth",
			  initialState: {
			    isAuthenticated: false,
			    user: null,
			    loading: false,
			    error: null,
			  },
			  reducers: {
			    clearError: (state) => {
			      state.error = null;
			    },
			    restoreSession: (state, action) => {
			      state.loading = false;
			      state.isAuthenticated = true;
			      state.user = action.payload;
			      state.error = null;
			    },
			  },
			  extraReducers: (builder) => {
			    builder
			      .addCase(createAccountThunk.pending, (state) => {
			        state.loading = true;
			        state.error = null;
			      })
			      .addCase(createAccountThunk.fulfilled, (state, action) => {
			        state.loading = false;
			        state.isAuthenticated = true;
			        state.user = action.payload;
			        state.error = null;
			      })
			      .addCase(createAccountThunk.rejected, (state, action) => {
			        state.loading = false;
			        state.error = action.error.message;
			      })
			      .addCase(loginWithEmailAndPassworThunk.pending, (state) => {
			        state.loading = true;
			        state.error = null;
			      })
			      .addCase(loginWithEmailAndPassworThunk.fulfilled, (state, action) => {
			        state.loading = false;
			        state.isAuthenticated = true;
			        state.user = action.payload;
			        state.error = null;
			      })
			      .addCase(loginWithEmailAndPassworThunk.rejected, (state, action) => {
			        state.loading = false;
			        state.error = action.error.message;
			      })
			      .addCase(logoutThunk.fulfilled, (state, action) => {
			        state.loading = false;
			        state.isAuthenticated = false;
			        state.user = action.payload;
			        state.error = null;
			      })
			      .addCase(logoutThunk.rejected, (state, action) => {
			        (state.loading = false), (state.error = action.error.message);
			      })
			      .addCase(googleLoginThunk.pending, (state) => {
			        state.loading = true;
			        state.error = null;
			      })
			      .addCase(googleLoginThunk.fulfilled, (state, action) => {
			        state.loading = false;
			        state.isAuthenticated = true;
			        state.user = action.payload;
			        state.error = null;
			      })
			      .addCase(googleLoginThunk.rejected, (state, action) => {
			        state.loading = false;
			        state.error = action.error.message;
			      })
			      .addCase(loginWithVerificationCodeThunk.pending, (state) => {
			        state.loading = true;
			        state.error = null;
			      })
			      .addCase(loginWithVerificationCodeThunk.fulfilled, (state, action) => {
			        state.loading = false;
			        state.isAuthenticated = true;
			        state.user = action.payload;
			        state.error = null;
			      })
			      .addCase(loginWithVerificationCodeThunk.rejected, (state, action) => {
			        state.loading = false;
			        state.error = action.payload;
			      })
			      .addCase(restoreActiveSessionThunk.pending, (state) => {
			        state.loading = true;
			        state.error = null;
			      })
			      .addCase(restoreActiveSessionThunk.fulfilled, (state, action) => {
			        state.loading = false;
			        state.isAuthenticated = true;
			        state.user = action.payload;
			        state.error = null;
			      })
			      .addCase(restoreActiveSessionThunk.rejected, (state, action) => {
			        state.loading = false;
			        state.error = action.error.message;
			      });
			  },
			});
			
			const authReducer = authSlice.reducer;
			export default authReducer;
			
			export const { clearError, restoreSession } = authSlice.actions;
			```
	- En `AppRouter.js`, se dispara el thunk `restoreActiveSessionThunk` para cuando se valida que hay una sesión activa en la función `onAuthStateChanged`. En este punto también podemos habilitar rutas o páginas para un rol determinado de usuario, por ejemplo si el para usuarios donde la propiedad `isAdmin` sea igual a `true`.
		```javascript
		import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
		import Layout from "../components/Layout/Layout";
		import Feed from "../pages/Feed/Feed";
		import Register from "../pages/Register/Register";
		import Login from "../pages/Login/Login";
		import PostDetails from "../pages/PostDetails/PostDetails";
		import Profile from "../pages/Profile/Profile";
		import PhoneLogin from "../pages/PhoneLogin/PhoneLogin";
		import VerificationCode from "../pages/VerificationCode/VerificationCode";
		import { useEffect, useState } from "react";
		import { onAuthStateChanged } from "firebase/auth";
		import { auth } from "../Firebase/firebaseConfig";
		import { useDispatch, useSelector } from "react-redux";
		import {
		  restoreActiveSessionThunk,
		  // restoreSession,
		} from "../redux/auth/authSlice";
		import PrivateRoutes from "./PrivateRoutes";
		import PublicRoutes from "./PublicRoutes";
		
		const AppRouter = () => {
		  const dispatch = useDispatch();
		  const { loading, isAuthenticated, user } = useSelector((store) => store.auth);
		  const [checking, setChecking] = useState(true);
		
		  useEffect(() => {
		    onAuthStateChanged(auth, (authUser) => {
		      if (authUser) {
		        // const loggedInUser = {
		        //   id: authUser.uid,
		        //   displayName: authUser.displayName,
		        //   email: authUser.email || null,
		        //   phoneNumber: authUser.phoneNumber || null,
		        //   accessToken: authUser.accessToken,
		        //   photoURL: authUser.photoURL,
		        // };
		        dispatch(restoreActiveSessionThunk(authUser.uid));
		      }
		      setChecking(false);
		    });
		  }, [dispatch]);
		
		  if (loading || checking) return <div>...Cargando</div>;
		
		  return (
		    <BrowserRouter>
		      <Routes>
		        <Route path="/" element={<Layout />}>
		          <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
		            <Route index element={<Feed />} />
		            <Route path="post/:postId" element={<PostDetails />} />
		            <Route path="profile/:userId" element={<Profile />} />
		            {user.isAdmin ? <Route path="dasboard" element={<Feed />} /> : null}
		          </Route>
		          <Route element={<PublicRoutes isAuthenticated={isAuthenticated} />}>
		            <Route path="register" element={<Register />} />
		            <Route path="login" element={<Login />} />
		            <Route path="phoneLogin" element={<PhoneLogin />} />
		            <Route
		              path="verificationCode/:phoneNumber"
		              element={<VerificationCode />}
		            />
		          </Route>
		
		          <Route path="*" element={<Navigate to={"/"} />} />
		        </Route>
		      </Routes>
		    </BrowserRouter>
		  );
		};
		
		export default AppRouter;
		```
## ¿Cómo manejar diseño responsivo con un hook personalizado?
1. Crear un hook personalizado que detecte el cambio del tamaño del ancho de la pantalla del navegador.
	- Los archivos del hook desde la estructura de carpetas
		```
		└── 📁src
		    └── 📁components
		        └── 📁DesktopNavbar
		            └── DestopNavbar.jsx
		        └── 📁Layout
		            └── Layout.jsx
		        └── 📁MobileNavbar
		            └── MobileNavbar.jsx
		    └── 📁Firebase
		        └── firebaseConfig.js
		    └── 📁hooks
		        └── useScreenDetector.jsx
		    └── 📁pages
		        └── 📁Feed
		            └── Feed.jsx
		        └── 📁Login
		            └── Login.jsx
		        └── 📁PhoneLogin
		            └── PhoneLogin.jsx
		        └── 📁PostDetails
		            └── PostDetails.jsx
		        └── 📁Profile
		            └── Profile.jsx
		        └── 📁Register
		            └── Register.jsx
		        └── 📁VerificationCode
		            └── VerificationCode.jsx
		    └── 📁redux
		        └── 📁auth
		            └── authSlice.js
		        └── store.js
		    └── 📁router
		        └── AppRouter.jsx
		        └── PrivateRoutes.jsx
		        └── PublicRoutes.jsx
		    └── 📁services
		        └── uploadFiles.js
		    └── main.jsx
		```
	- Se crea el hook `useScreenDetector` en `useScreenDetector.jsx`:
		```javascript
		import { useEffect, useMemo, useState } from "react";
		
		//Definir las constantes para los breakpoints
		
		const MOBILE_BREAKPOINT = 768;
		const TABLET_BREAKPOINT = 1024;
		
		const useScreenDetector = () => {
		  //Definir un estado con useState para guardar el ancho actual de la pantalla
		  const [width, setWidth] = useState(window.innerWidth);
		
		  useEffect(() => {
		    const handleWindowSizeChange = () => setWidth(window.innerWidth);
		    window.addEventListener("resize", handleWindowSizeChange);
		
		    return () => {
		      window.removeEventListener("resize", handleWindowSizeChange);
		    };
		  }, []);
		
		  const screenType = useMemo(() => {
		    if (width <= MOBILE_BREAKPOINT) return "mobile";
		    if (width <= TABLET_BREAKPOINT) return "tablet";
		    return "desktop";
		  }, [width]);
		
		  return {
		    isMobile: screenType === "mobile",
		    isTablet: screenType === "tablet",
		    isDesktop: screenType === "desktop",
		    screenType,
		  };
		};
		
		export default useScreenDetector;
		```
3. Llamar el hook en el o los componentes donde necesitamos saber el tipo de pantalla del navegador para poder mostrar o esconder elementos. En el ejemplo, se llama el hook desde el componente `Layout.jsx` para esconder o mostrar las barras de navegación
	```javascript
	import { useDispatch, useSelector } from "react-redux";
	import { Outlet, useNavigate } from "react-router-dom";
	import { logoutThunk } from "../../redux/auth/authSlice";
	import DestopNavbar from "../DesktopNavbar/DestopNavbar";
	import MobileNavbar from "../MobileNavbar/MobileNavbar";
	import useScreenDetector from "../../hooks/useScreenDetector";
	
	const Layout = () => {
	  const navigate = useNavigate();
	  const dispatch = useDispatch();
	  const { isDesktop, isTablet, isMobile } = useScreenDetector();
	  const { isAuthenticated } = useSelector((store) => store.auth);
	
	  const handleLogout = () => dispatch(logoutThunk());
	  const handleBackNavigation = () => navigate(-1);
	
	  return (
	    <div>
	      <header>{(isDesktop || isTablet) && <DestopNavbar />}</header>
	      <button onClick={handleBackNavigation}>Ir atrás</button>
	      {isAuthenticated && <button onClick={handleLogout}>Cerrar sesión</button>}
	      Layout
	      <Outlet />
	      <footer>{isMobile && <MobileNavbar />}</footer>
	    </div>
	  );
	};
	
	export default Layout;
	```
