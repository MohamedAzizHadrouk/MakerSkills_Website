import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useCanonicalSlugRedirect(
  urlParam: string | undefined,
  entitySlug: string | undefined,
  buildPath: (slug: string) => string,
): void {
  const navigate = useNavigate();

  useEffect(() => {
    if (!urlParam || !entitySlug || urlParam === entitySlug) {
      return;
    }

    navigate(buildPath(entitySlug), { replace: true });
  }, [urlParam, entitySlug, navigate, buildPath]);
}
