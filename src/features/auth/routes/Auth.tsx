// src/features/auth/routes/Auth.tsx

// CHANGED: Removed 'Cloud' and imported your new 'Logo' component
import {Logo} from '../../../components/ui/Logo';
import {LoginForm} from '../components/LoginForm';
import {useTheme} from '../../../contexts/ThemeContext';
import {Card} from '../../../components/ui/Card';

export const Auth = () => {
    const {currentTheme} = useTheme();

  return (
      <div
          className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300"
          style={{backgroundColor: currentTheme.colors.background.secondary}}
      >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div
                className="rounded-lg p-2"
                style={{
                    backgroundColor: currentTheme.colors.brand.primary,
                    // CHANGED: The color is now set on the parent div...
                    color: currentTheme.colors.text.inverse,
                }}
            >
                {/* CHANGED: ...and the Logo component inherits it automatically. */}
                <Logo className="h-12 w-12"/>
          </div>
        </div>
          <h2
              className="mt-6 text-center text-3xl font-bold tracking-tight"
              style={{color: currentTheme.colors.text.primary}}
          >
          Sign in to your account
        </h2>
          <p
              className="mt-2 text-center text-sm"
              style={{color: currentTheme.colors.text.secondary}}
          >
          Enter your credentials to sign in
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card elevated padding="lg">
          <LoginForm />

              {/* This custom section for test credentials remains, as it's unique to this page */}
          {import.meta.env.MODE === 'development' && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                      <div
                          className="w-full border-t"
                          style={{borderColor: currentTheme.colors.border.primary}}
                      />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span
                        className="px-2"
                        style={{
                            backgroundColor: currentTheme.colors.background.primary,
                            color: currentTheme.colors.text.secondary
                        }}
                    >
                      Test Credentials
                    </span>
                  </div>
                </div>
                <div className="mt-6 text-center text-sm">
                    <div style={{color: currentTheme.colors.text.secondary}}>
                        Email: example@example.com
                    </div>
                    <div style={{color: currentTheme.colors.text.secondary}}>
                        Password: @Tester1154
                    </div>
                </div>
              </div>
          )}
          </Card>
      </div>
    </div>
  );
};