# LoadingMask Component

A flexible and customizable loading mask component with multiple animation variants and configuration options.

## Features

- 🎨 **6 Animation Variants**: spinner, pulse, bounce, rotate, compass, zap
- 📏 **4 Sizes**: sm, md, lg, xl
- 🎭 **Overlay Support**: Customizable background overlay with opacity control
- 🌟 **Background Blur**: Optional blur effect for background content
- 🎯 **TypeScript**: Full TypeScript support with proper type definitions
- 🪝 **Custom Hook**: Includes `useLoading` hook for state management
- 📱 **Responsive**: Works on all screen sizes
- 🌙 **Dark Mode**: Full dark mode support

## Installation

The component is already included in your project at `/client/components/ui/loading-mask.tsx`.

## Usage Examples

### Basic Loading Mask

```tsx
import { LoadingMask, useLoading } from "@/components/ui/loading-mask";

const MyComponent = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();

  return (
    <LoadingMask
      isLoading={isLoading}
      variant="spinner"
      size="md"
      text="Loading..."
      overlay={80}
    >
      <div>Your content here</div>
    </LoadingMask>
  );
};
```

### Full Page Loading

```tsx
import { FullPageLoading } from "@/components/ui/loading-mask";

const App = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  return (
    <>
      {isInitializing && (
        <FullPageLoading
          variant="compass"
          size="lg"
          text="Initializing application..."
        />
      )}
      <YourApp />
    </>
  );
};
```

### Inline Loading

```tsx
import { InlineLoading } from "@/components/ui/loading-mask";

const DataList = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <InlineLoading variant="bounce" size="md" text="Fetching data..." />;
  }

  return <div>Your data here</div>;
};
```

### Integration with Redux/Async Operations

```tsx
import { LoadingMask } from "@/components/ui/loading-mask";
import { useAppSelector } from "@/store/hooks";

const AuthModal = () => {
  const isCheckingEmail = useAppSelector(selectIsCheckingEmail);
  const isCreatingUser = useAppSelector(selectIsCreatingUser);
  const isVerifyingCode = useAppSelector(selectIsVerifyingCode);

  const isLoading = isCheckingEmail || isCreatingUser || isVerifyingCode;

  return (
    <LoadingMask
      isLoading={isLoading}
      variant="spinner"
      text={
        isCheckingEmail
          ? "Checking email..."
          : isCreatingUser
            ? "Creating account..."
            : isVerifyingCode
              ? "Verifying code..."
              : "Loading..."
      }
      blur={true}
    >
      <AuthFormContent />
    </LoadingMask>
  );
};
```

## Animation Variants

### `spinner` (default)

Classic spinning loader using Lucide's Loader2 icon.

### `pulse`

Animated pulsing circle with ping effect.

### `bounce`

Three bouncing dots with staggered animation.

### `rotate`

Rotating refresh icon with custom duration.

### `compass`

Compass icon with dual-ring rotation effect.

### `zap`

Lightning bolt with pulsing and ping effects.

## Props Reference

### LoadingMask Props

| Prop               | Type             | Default     | Description                         |
| ------------------ | ---------------- | ----------- | ----------------------------------- |
| `isLoading`        | `boolean`        | -           | Whether the loading mask is visible |
| `variant`          | `LoadingVariant` | `"spinner"` | Animation variant                   |
| `size`             | `LoadingSize`    | `"md"`      | Size of the loading icon            |
| `text`             | `string`         | -           | Loading text to display             |
| `overlay`          | `number`         | `80`        | Background overlay opacity (0-100)  |
| `className`        | `string`         | -           | Custom className for container      |
| `contentClassName` | `string`         | -           | Custom className for content area   |
| `blur`             | `boolean`        | `false`     | Whether to blur background content  |
| `children`         | `ReactNode`      | -           | Content to render behind the mask   |

### useLoading Hook

```tsx
const {
  isLoading,      // Current loading state
  startLoading,   // Function to start loading
  stopLoading,    // Function to stop loading
  toggleLoading,  // Function to toggle loading state
  setIsLoading,   // Direct state setter
} = useLoading(initialState?: boolean);
```

## Styling

The component uses Tailwind CSS classes and can be customized through:

- `className`: Style the outer container
- `contentClassName`: Style the loading content area
- CSS custom properties for brand colors (`brand-blue`, `brand-cyan`)

## Examples in Your App

### Authentication Flow

```tsx
// In SignInModal.tsx
<LoadingMask
  isLoading={isCheckingEmail || isCreatingUser || isVerifyingCode}
  variant="compass"
  text={getLoadingText()}
  overlay={90}
  blur={true}
>
  <AuthForm />
</LoadingMask>
```

### Data Fetching

```tsx
// In any data component
<LoadingMask isLoading={isFetching} variant="bounce" text="Fetching trips...">
  <TripsList />
</LoadingMask>
```

### Form Submission

```tsx
// During form submission
<LoadingMask
  isLoading={isSubmitting}
  variant="zap"
  text="Saving changes..."
  overlay={70}
>
  <CheckoutForm />
</LoadingMask>
```

## Demo

To see all variants and features in action, visit the demo page:

```tsx
import { LoadingDemo } from "@/pages/LoadingDemo";
```

## Best Practices

1. **Choose appropriate variants**: Use `spinner` for general loading, `bounce` for data fetching, `zap` for quick actions
2. **Provide meaningful text**: Always include descriptive loading text for better UX
3. **Use appropriate sizing**: Match the loading size to your content area
4. **Consider accessibility**: The component includes proper ARIA attributes
5. **Combine with blur**: Use blur effect for better visual separation when overlaying content

## Performance

- Lightweight: Uses only Lucide icons and Tailwind CSS
- Smooth animations: CSS-based animations for optimal performance
- Tree-shakeable: Import only what you need
