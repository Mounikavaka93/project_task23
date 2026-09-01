import { ThemeProvider } from './ThemeContext'
import { CartProvider } from './CartContext'
import { WishlistProvider } from './WishlistContext'
import { AuthProvider } from './AuthContext'
import { ToastProvider } from './ToastContext'
import { CompareProvider } from './CompareContext'
import { RecentlyViewedProvider } from './RecentlyViewedContext'
import { UIProvider } from './UIContext'

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <RecentlyViewedProvider>
                  <UIProvider>{children}</UIProvider>
                </RecentlyViewedProvider>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
