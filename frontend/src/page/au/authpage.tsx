import LoginForm from "../../components/AuthForms/LoginForm";
import RegisterForm from "../../components/AuthForms/RegisterForm";
import ForgotPasswordForm from "../../components/AuthForms/ForgotPasswordForm";
import "./auth.css";

const AuthPage = () => {
    return (
        <main>
            <section id="login" className="auth-screen">
                <LoginForm />
            </section>
            <section id="register" className="auth-screen">
                <RegisterForm />
            </section>
            <section id="forgot" className="auth-screen">
                <ForgotPasswordForm />
            </section>
        </main>
    );
};

export default AuthPage;
