let pathname = $state(typeof window !== 'undefined' ? window.location.pathname : '/about');
let search = $state(typeof window !== 'undefined' ? window.location.search : '');

function syncFromWindow() {
  pathname = window.location.pathname;
  search = window.location.search;
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', syncFromWindow);
}

export function getRouterPath(): string {
  return pathname;
}

export function getRouterSearch(): string {
  return search;
}

export function getRouterQuery(): Record<string, string> {
  const params = new URLSearchParams(search.replace(/^\?/, ''));
  const query: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    query[key] = value;
  }
  return query;
}

export function getRouterFullPath(): string {
  return pathname + search;
}

export function routerPush(path: string, query?: Record<string, string>, replace = false) {
  const searchStr = query ? `?${new URLSearchParams(query).toString()}` : '';
  const url = path + searchStr;
  if (replace) {
    history.replaceState(null, '', url);
  } else {
    history.pushState(null, '', url);
  }
  syncFromWindow();
}

export function routerReplace(path: string, query?: Record<string, string>) {
  routerPush(path, query, true);
}
