import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { BookLayout } from "./features/book/BookLayout";
import { BookSignUp } from "./features/book/pages/BookSignUp";
import { BookLogin } from "./features/book/pages/BookLogin";
import { BookLanding } from "./features/book/pages/BookLanding";
import { StepProfile } from "./features/book/pages/StepProfile";
import { StepSchedule } from "./features/book/pages/StepSchedule";
import { StepPayment } from "./features/book/pages/StepPayment";
import { BookSuccess } from "./features/book/pages/BookSuccess";
import { BookCancel } from "./features/book/pages/BookCancel";
import { BookWizardProvider } from "./features/book/wizardContext";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { loading, session } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text-secondary text-sm">Memuat sesi…</div>
      </div>
    );
  }
  if (!session) return <Navigate to="/signup" replace />;
  return <>{children}</>;
}

export default function BookApp() {
  return (
    <AuthProvider>
      <BookWizardProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<BookLayout />}>
              <Route index element={<BookLanding />} />
              <Route path="signup" element={<BookSignUp />} />
              <Route path="login" element={<BookLogin />} />
              <Route
                path="book/profile"
                element={<RequireAuth><StepProfile /></RequireAuth>}
              />
              <Route
                path="book/schedule"
                element={<RequireAuth><StepSchedule /></RequireAuth>}
              />
              <Route
                path="book/payment"
                element={<RequireAuth><StepPayment /></RequireAuth>}
              />
              <Route path="success" element={<BookSuccess />} />
              <Route path="cancel" element={<BookCancel />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BookWizardProvider>
    </AuthProvider>
  );
}
