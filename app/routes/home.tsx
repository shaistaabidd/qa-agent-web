import { redirectToAppOrLogin } from '@/features/auth';
import { RouteLoadingScreen } from '@/shell/RouteLoadingScreen';

export async function clientLoader({ request }: { request: Request }) {
  redirectToAppOrLogin(request);
  return null;
}
clientLoader.hydrate = true as const;

export default function Home() {
  return <RouteLoadingScreen />;
}
