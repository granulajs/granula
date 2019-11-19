import {
  Injectable,
  ComponentRef,
  Type,
  Injector,
  ErrorHandler,
  ComponentFactoryResolver,
  ApplicationInitStatus,
  ComponentFactory,
  ɵisBoundToModule__POST_R3__,
  InjectionToken,
  isDevMode,
  NgModuleRef,
  Testability,
  TestabilityRegistry,
  ViewRef,
  APP_BOOTSTRAP_LISTENER
} from '@angular/core';
import { Observable } from 'rxjs';

export const ALLOW_MULTIPLE_PLATFORMS = new InjectionToken<boolean>(
  'AllowMultipleToken'
);

let isBoundToModule: <C>(
  cf: ComponentFactory<C>
) => boolean = ɵisBoundToModule__POST_R3__;

@Injectable()
export class GranulaApplicationRef {
  /** @internal */
  private _bootstrapListeners: ((compRef: ComponentRef<any>) => void)[] = [];
  private _views: any[] = [];
  private _runningTick: boolean = false;
  private _enforceNoNewChanges: boolean = false;
  private _globalRefresh: number = 100;

  /**
   * Get a list of component types registered to this application.
   * This list is populated even before the component is created.
   */
  public readonly componentTypes: Type<any>[] = [];

  /**
   * Get a list of components registered to this application.
   */
  public readonly components: ComponentRef<any>[] = [];

  /**
   * Returns an Observable that indicates when the application is stable or unstable.
   *
   * @see  [Usage notes](#is-stable-examples) for examples and caveats when using this API.
   */
  // TODO(issue/24571): remove '!'.
  public readonly isStable!: Observable<boolean>;

  /** @internal */
  constructor(
    private _injector: Injector,
    private _exceptionHandler: ErrorHandler,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _initStatus: ApplicationInitStatus
  ) {
    this._enforceNoNewChanges = isDevMode();

    const redraw = () => {
      this.tick();
      setTimeout(redraw, this._globalRefresh);
    };
    setTimeout(redraw, this._globalRefresh);

    let timer;
    document.addEventListener('scroll', () => {
      clearTimeout(timer);
      this._globalRefresh = 400;
      timer = setTimeout(() => {
        this._globalRefresh = 100;
      }, 100);
    }, false);
  }

  /**
   * Bootstrap a new component at the root level of the application.
   *
   * @usageNotes
   * ### Bootstrap process
   *
   * When bootstrapping a new root component into an application, Angular mounts the
   * specified application component onto DOM elements identified by the componentType's
   * selector and kicks off automatic change detection to finish initializing the component.
   *
   * Optionally, a component can be mounted onto a DOM element that does not match the
   * componentType's selector.
   *
   * ### Example
   * {@example core/ts/platform/platform.ts region='longform'}
   */
  bootstrap<C>(
    componentOrFactory: ComponentFactory<C> | Type<C>,
    rootSelectorOrNode?: string | any
  ): ComponentRef<C> {
    if (!this._initStatus.done) {
      throw new Error(
        'Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.'
      );
    }
    let componentFactory: ComponentFactory<C>;
    if (componentOrFactory instanceof ComponentFactory) {
      componentFactory = componentOrFactory;
    } else {
      componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        componentOrFactory
      )!;
    }
    this.componentTypes.push(componentFactory.componentType);

    // Create a factory associated with the current module if it's not bound to some other
    const ngModule = isBoundToModule(componentFactory)
      ? null
      : this._injector.get(NgModuleRef);
    const selectorOrNode = rootSelectorOrNode || componentFactory.selector;
    const compRef = componentFactory.create(
      Injector.NULL,
      [],
      selectorOrNode,
      ngModule
    );

    compRef.onDestroy(() => {
      this._unloadComponent(compRef);
    });
    const testability = compRef.injector.get(Testability, null);
    if (testability) {
      compRef.injector
        .get(TestabilityRegistry)
        .registerApplication(compRef.location.nativeElement, testability);
    }

    this._loadComponent(compRef);
    if (isDevMode()) {
      console.log(
        `Angular is running in the development mode. Call enableProdMode() to enable the production mode.`
      );
    }
    return compRef;
  }

  /**
   * Invoke this method to explicitly process change detection and its side-effects.
   *
   * In development mode, `tick()` also performs a second change detection cycle to ensure that no
   * further changes are detected. If additional changes are picked up during this second cycle,
   * bindings in the app have side-effects that cannot be resolved in a single change detection
   * pass.
   * In this case, Angular throws an error, since an Angular application can only have one change
   * detection pass during which all change detection must complete.
   */
  tick(): void {
    if (this._runningTick) {
      throw new Error('ApplicationRef.tick is called recursively');
    }

    try {
      this._runningTick = true;
      for (let view of this._views) {
        view.detectChanges();
      }
      if (this._enforceNoNewChanges) {
        for (let view of this._views) {
          view.checkNoChanges();
        }
      }
    } catch (e) {
      // Attention: Don't rethrow as it could cancel subscriptions to Observables!
      this._exceptionHandler.handleError(e);
    } finally {
      this._runningTick = false;
    }
  }

  /**
   * Attaches a view so that it will be dirty checked.
   * The view will be automatically detached when it is destroyed.
   * This will throw if the view is already attached to a ViewContainer.
   */
  attachView(viewRef: ViewRef): void {
    const view = viewRef as any;
    this._views.push(view);
    view.attachToAppRef(this);
  }

  /**
   * Detaches a view from dirty checking again.
   */
  detachView(viewRef: ViewRef): void {
    const view = viewRef as any;
    remove(this._views, view);
    view.detachFromAppRef();
  }

  private _loadComponent(componentRef: ComponentRef<any>): void {
    this.attachView(componentRef.hostView);
    this.tick();
    this.components.push(componentRef);
    // Get the listeners lazily to prevent DI cycles.
    const listeners = this._injector
      .get(APP_BOOTSTRAP_LISTENER, [])
      .concat(this._bootstrapListeners);
    listeners.forEach(listener => listener(componentRef));
  }

  private _unloadComponent(componentRef: ComponentRef<any>): void {
    this.detachView(componentRef.hostView);
    remove(this.components, componentRef);
  }

  /** @internal */
  ngOnDestroy() {
    this._views.slice().forEach(view => view.destroy());
  }

  /**
   * Returns the number of attached views.
   */
  get viewCount() {
    return this._views.length;
  }
}

function remove<T>(list: T[], el: T): void {
  const index = list.indexOf(el);
  if (index > -1) {
    list.splice(index, 1);
  }
}
