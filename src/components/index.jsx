import React, { useCallback, useMemo, useState } from 'react';
import '../components/sign-in/sign-in.css'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const REGISTER_STEP = {
  EMAIL_STEP: 1,
  INFOR_STEP: 2,
}

function Form(props) {
  const [currentStep, setCurrentStep] = useState(REGISTER_STEP.EMAIL_STEP);

  const validationEmail = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required('Required!'),
    }),

    onSubmit: (values) => {
      // step 1 : kiem tra xem email đã đki chưa
      // step 2 chuyển sang step tiếp theo/ hiển thị loi
      setCurrentStep((step) => step + 1);
    },
  });

  const validationInfor = useFormik({
    initialValues: {
      name: '',
      password: '',
      confirmPassword: '',
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Mininum 2 characters')
        .max(50, 'Maximum 50 characters')
        .required('Name Required!'),
      password: Yup.string()
        .min(6, 'Minimum 6 characters')
        .required('Password Required!'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], "Password's not match")
        .required('Re-Password Required!'),
    }),

    onSubmit: (values) => {
      const { name, password, confirmPassword } = values;

      const data = {
        name,
        password,
        confirmPassword,
        email: validationEmail.values.email,
      };

      

      setCurrentStep(REGISTER_STEP.SUCCESS_STEP);
    },
  });

  const getButtonContent = useMemo(() => {
    switch (currentStep) {
      case REGISTER_STEP.EMAIL_STEP:
        return 'Continue'

      case REGISTER_STEP.INFOR_STEP:
        return 'Agree and continue'
      default:
        return 'next step'
    }
  }, [currentStep]);

  const onClickButton = useCallback((e) => {
    e.preventDefault();
    if (currentStep === REGISTER_STEP.EMAIL_STEP) {
      validationEmail.handleSubmit();
    }
    if (currentStep === REGISTER_STEP.input) {
      validationInfor.handleSubmit();
    }
  },
    [currentStep, validationEmail, validationInfor],
  )

  return (
    <div>
      <main className="form-signin w-100 m-auto">
        <h1 className="h3 mb-3 fw-normal">Hi! / Sign up</h1>

        {
          currentStep === REGISTER_STEP.EMAIL_STEP && (
            
        <div className="form-floating mb-4">
          <input
            type="text"
            name='email'
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={validationEmail.values.email}
            onChange={validationEmail.handleChange}
            onBlur={validationEmail.handleBlur}
            style={{
              borderColor:
                validationEmail.errors?.email && validationEmail.touched?.email
                  ? 'red'
                  : 'black',
            }}
          />
          <label htmlFor="floatingInput ">Email address</label>
          {validationEmail.errors?.email}
        </div>
        
        )
        }
        {
          currentStep === REGISTER_STEP.INFOR_STEP && (
            <>
            <div className="form-floating mb-4">
            <input
              type="text"
              name='name'
              className="form-control"
              id="floatingName"
              placeholder="Name"
              value={validationInfor.values.name}
              onChange={validationInfor.handleChange}
              onBlur={validationInfor.handleBlur}
              style={{
                borderColor:
                  validationInfor.errors?.name && validationInfor.touched?.name
                    ? 'red'
                    : 'black',
              }}
            />
            <label htmlFor="floatingName ">Name</label>
            {validationInfor.errors?.name}
          </div>
  
          <div className="form-floating">
            <input
              type="password"
              name='password'
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={validationInfor.values.password}
              onChange={validationInfor.handleChange}
              onBlur={validationInfor.handleBlur}
              style={{
                borderColor:
                  validationInfor.errors?.password && validationInfor.touched?.password
                    ? 'red'
                    : 'black',
              }}
            />
            <label htmlFor="floatingPassword ">Password</label>
            {validationInfor.errors?.password}
          </div>
          </>
          )
        }



        <button className="btn btn-primary w-100 py-2" type="submit" onClick={onClickButton}>
          {
            getButtonContent
          }

        </button>
        <p className="mt-5 mb-3 text-body-secondary">© O A N H</p>

      </main>
    </div>
  );

export default Form;