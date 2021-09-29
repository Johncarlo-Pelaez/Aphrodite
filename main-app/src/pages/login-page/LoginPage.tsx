import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  return (
    <div className={styles.loginContainer}>
      <Form className={styles.loginForm}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <div className="d-grid">
          <Button variant="primary" type="submit">
            Log In
          </Button>
        </div>
      </Form>
    </div>
  );
};
