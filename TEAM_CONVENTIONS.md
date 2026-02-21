# Team Folder Structure & Conventions

This document outlines the folder structure and coding conventions for our Next.js project.

## 📁 Folder Structure

```
src/
├── app/                    # Next.js App Router pages ( Router page is not a folder)
│   ├── (auth)/            # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
components
│   ├── ui/               # Basic UI
│   ├── reusable/         # Reusable
│   ├── other folders/         # etc many more
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
│       ├── user/         # User-related components
│       ├── auth/         # Authentication components
│       └── dashboard/    # Dashboard components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── services/             # API calls and external services
├── types/                # TypeScript type definitions
├── constants/            # Application constants
└── env.ts               # Environment validation
```

## 📋 Naming Conventions

### Files & Folders

- **Components**: PascalCase (`UserCard.tsx`, `LoginForm.tsx`)
- **Hooks**: camelCase starting with "use" (`useUsers.ts`, `useAuth.ts`)
- **Utilities**: camelCase (`utils.ts`, `api.ts`)
- **Types**: camelCase (`user.ts`, `api.ts`)
- **Constants**: camelCase (`index.ts`, `routes.ts`)

### Code

- **Components**: PascalCase (`UserCard`, `LoginButton`)
- **Functions**: camelCase (`getUserById`, `formatDate`)
- **Variables**: camelCase (`userData`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)

## 🗂️ Component Organization

### UI Components (`/components/ui/`)

Basic, reusable ShadCN components with no business logic:

- `Button.tsx`
- `Input.tsx`
- `Card.tsx`
- `Spinner.tsx`

### Layout Components (`/components/layout/`)

Components for page structure:

- `Header.tsx`
- `Footer.tsx`
- `Sidebar.tsx`
- `Navigation.tsx`

### Feature Components (`/components/features/`)

Organized by domain/feature:

- `user/UserCard.tsx`
- `user/UserList.tsx`
- `auth/LoginForm.tsx`
- `dashboard/StatsCard.tsx`

## 🔗 Import Organization

Order imports in this sequence:

1. React and Next.js imports
2. External libraries
3. Internal components (UI first, then features)
4. Utilities and services
5. Types
6. Constants

```tsx
import React from "react";
import Link from "next/link";
import { clsx } from "clsx";

import { Button } from "@/components/ui/button";
import { UserCard } from "@/components/features/user/UserCard";
import { formatDate } from "@/lib/utils";
import { userService } from "@/services/user";
import { User } from "@/types";
import { ROUTES } from "@/constants";
```

## 📄 File Templates

### Component Template

```tsx
// Brief description of what this component does
interface ComponentNameProps {
  // Props with JSDoc comments
}

export function ComponentName({ }: ComponentNameProps) {
  // Component logic

  return (
    // JSX
  );
}
```

### Hook Template

```tsx
// Brief description of what this hook does
export function useHookName() {
  // Hook logic

  return {
    // Return object with clear naming
  };
}
```

### Service Template

```tsx
// Brief description of what this service handles
export const serviceName = {
  async methodName(): Promise<ReturnType> {
    // Service method logic
  },
};
```

## 🎯 Best Practices

### Component Guidelines

1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Default Props**: Use default parameters instead of defaultProps
4. **Error Boundaries**: Wrap feature components in error boundaries

### State Management

1. **Local State**: Use `useState` for component-level state
2. **Server State**: Use custom hooks (like `useUsers`) for API data
3. **Global State**: Add Context API or Zustand when needed

### Performance

1. **Lazy Loading**: Use `dynamic` imports for heavy components
2. **Memoization**: Use `memo`, `useMemo`, `useCallback` when appropriate
3. **Image Optimization**: Always use Next.js `Image` component

### TypeScript

1. **Strict Mode**: Keep strict TypeScript settings
2. **Type Exports**: Export types from their respective feature folders
3. **Generic Types**: Use generics for reusable utility types

## 🚀 Getting Started

1. **Create new feature**:

   ```bash
   mkdir src/components/features/your-feature
   mkdir src/types/api
   ```

2. **Add new page**:

   ```bash
   mkdir src/app/your-page
   touch src/app/your-page/page.tsx
   ```

3. **Create service**:

   ```bash
   touch src/services/your-service.ts
   ```

4. **Add types**:
   ```bash
   touch src/types/your-types.ts
   ```

## 🔍 Code Review Checklist

- [ ] Component follows single responsibility principle
- [ ] TypeScript interfaces are defined for all props
- [ ] Imports are organized correctly
- [ ] Naming conventions are followed
- [ ] No unused imports or variables
- [ ] Error handling is implemented
- [ ] Component is properly documented

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/learn)
- [Tailwind CSS](https://tailwindcss.com/docs)
