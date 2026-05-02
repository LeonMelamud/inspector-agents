import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accept = request.headers.get('accept') || '';

  // Content negotiation: Accept: text/markdown → serve index.md
  if (pathname === '/' && accept.includes('text/markdown')) {
    return NextResponse.rewrite(new URL('/index.md', request.url));
  }

  // ?mode=agent → serve machine-readable agent view
  if (request.nextUrl.searchParams.get('mode') === 'agent') {
    return NextResponse.rewrite(new URL('/api/agent-view', request.url));
  }

  const response = NextResponse.next();

  // Add HTTP Link headers (RFC 8288) to all HTML pages
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    const links = [
      '<https://inspectagents.com/sitemap.xml>; rel="sitemap"',
      '<https://inspectagents.com/api/openapi.json>; rel="service-desc"',
      '<https://inspectagents.com/.well-known/api-catalog>; rel="api-catalog"',
      '<https://inspectagents.com/llms.txt>; rel="alternate"; type="text/plain"',
      '<https://inspectagents.com/index.md>; rel="alternate"; type="text/markdown"',
      '<https://inspectagents.com/.well-known/mcp.json>; rel="describedby"; type="application/json"',
    ];
    response.headers.set('Link', links.join(', '));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
