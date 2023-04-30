import {inject, Inject, Injectable, OnDestroy} from '@angular/core';
import {IUserDbService, IUserDbServiceToken} from "../interfaces/IUserDbService";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {IUser} from "../models/IUser";
import {UsersToken} from "./fb-db.service";

@Injectable()
export class FbEntitiesService implements OnDestroy{
  constructor(
    @Inject(IUserDbServiceToken)
    private fbDb: IUserDbService
  ) {}
  private destroy$ = new Subject<void>();

  private _users$ = inject(UsersToken)
    .pipe(takeUntil(this.destroy$))
    .subscribe(users => this.users$.next(users));

  public users$ = new BehaviorSubject<IUser[]>([]);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
