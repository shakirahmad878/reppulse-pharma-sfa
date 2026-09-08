import { StorageService, STORAGE_KEYS } from './storageService';
import { RoutePlan, RouteChangeRequest } from '../types';
import { BARAK_ROUTES, CURRENT_USER } from '../constants/mockData';

const ROUTE_STORAGE_KEY = 'REPPULSE_ROUTES';
const ACTIVE_ROUTE_KEY = 'REPPULSE_ACTIVE_ROUTE_ID';
const ROUTE_REQUESTS_KEY = 'REPPULSE_ROUTE_CHANGE_REQUESTS';

export class RouteService {
  public static async getRoutes(): Promise<RoutePlan[]> {
    let routes = await StorageService.getItem<RoutePlan[]>(ROUTE_STORAGE_KEY, []);
    if (!routes || routes.length === 0) {
      routes = BARAK_ROUTES;
      await StorageService.setItem(ROUTE_STORAGE_KEY, routes);
    }
    const activeRouteId = await this.getActiveRouteId();
    return routes.map(r => ({
      ...r,
      isActiveToday: r.id === activeRouteId,
    }));
  }

  public static async getActiveRouteId(): Promise<string> {
    const activeId = await StorageService.getItem<string>(ACTIVE_ROUTE_KEY, 'route-cachar-01');
    return activeId || 'route-cachar-01';
  }

  public static async getActiveRoute(): Promise<RoutePlan> {
    const routes = await this.getRoutes();
    const activeId = await this.getActiveRouteId();
    return routes.find(r => r.id === activeId) || routes[0];
  }

  public static async setActiveRoute(routeId: string): Promise<boolean> {
    const routes = await this.getRoutes();
    const target = routes.find(r => r.id === routeId);
    if (!target) return false;

    await StorageService.setItem(ACTIVE_ROUTE_KEY, routeId);
    const updated = routes.map(r => ({
      ...r,
      isActiveToday: r.id === routeId,
    }));
    await StorageService.setItem(ROUTE_STORAGE_KEY, updated);
    return true;
  }

  public static async getRouteChangeRequests(): Promise<RouteChangeRequest[]> {
    return await StorageService.getItem<RouteChangeRequest[]>(ROUTE_REQUESTS_KEY, []);
  }

  public static async requestRouteChange(requestedRouteId: string, reason: string): Promise<RouteChangeRequest> {
    const routes = await this.getRoutes();
    const activeRoute = await this.getActiveRoute();
    const targetRoute = routes.find(r => r.id === requestedRouteId);

    const request: RouteChangeRequest = {
      id: 'req_' + Date.now() + '_' + Math.random().toString(36).substring(7),
      employeeId: CURRENT_USER.id,
      employeeName: CURRENT_USER.name,
      currentRouteId: activeRoute.id,
      currentRouteName: activeRoute.name,
      requestedRouteId: targetRoute ? targetRoute.id : requestedRouteId,
      requestedRouteName: targetRoute ? targetRoute.name : 'Unknown Route',
      reason: reason.trim() || 'Schedule adjustment requested for client priority.',
      requestTimestamp: new Date().toISOString(),
      status: 'PENDING_APPROVAL',
    };

    const existing = await this.getRouteChangeRequests();
    const updated = [request, ...existing];
    await StorageService.setItem(ROUTE_REQUESTS_KEY, updated);
    return request;
  }

  public static async adminReviewRequest(
    requestId: string,
    approve: boolean,
    reviewComment?: string
  ): Promise<boolean> {
    const requests = await this.getRouteChangeRequests();
    const idx = requests.findIndex(r => r.id === requestId);
    if (idx === -1) return false;

    const req = requests[idx];
    req.status = approve ? 'APPROVED' : 'REJECTED';
    req.reviewedBy = 'Regional Admin (Indore/Guwahati HQ)';
    req.reviewedTimestamp = new Date().toISOString();
    req.reviewComment = reviewComment || (approve ? 'Route deviation approved by Admin.' : 'Route deviation rejected by Admin.');

    if (approve) {
      await this.setActiveRoute(req.requestedRouteId);
    }

    requests[idx] = req;
    await StorageService.setItem(ROUTE_REQUESTS_KEY, requests);
    return true;
  }
}
