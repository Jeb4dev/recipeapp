import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  // Public routes that are available to everyone
  const publicRoutes = ['/', '/login', '/register', '/recipes', '/account'];
  const limitedRoutes = ['/dashboard', '/newrecipe', '/editrecipe'];

  // Check if the path is a recipe route (e.g., '/recipes/PtGNUBBWSRyMInlrGu9ruQ')
  const isRecipeRoute = path.startsWith('/recipes/') || path.startsWith('/editrecipe/');

  // If the path is a public route or a recipe route, do not redirect
  if (publicRoutes.includes(path) || isRecipeRoute) {
    return;
  }

  // If the user is not authenticated and the requested path is '/dashboard' or '/newrecipe',
  // redirect the user to the '/login' page
  if (!currentUser && limitedRoutes.includes(path)) {
    return Response.redirect(new URL('/login', request.url));
  }

  // If the user is authenticated and the requested path is not '/dashboard' or '/newrecipe',
  // redirect the user to the '/dashboard' page
  if (currentUser && !limitedRoutes.includes(path)) {
    // Redirect the user to the '/404' page if the requested path is not found
    return Response.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)'],
};
