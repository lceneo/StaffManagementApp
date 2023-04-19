import {Component, Inject, OnInit} from '@angular/core';
import {IUser} from "../../../shared/models/IUser";
import {ActivatedRoute} from "@angular/router";
import {map, mergeMap} from "rxjs";
import {IUserDbService, IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit{
  public user?: IUser;

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(IUserDbServiceToken)
    private fbDb: IUserDbService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        mergeMap(params => this.fbDb.getUserById$(params["id"])),
        map(res => res[0].payload.doc.data()))
      .subscribe(user => this.user = user);
  }
}
