import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FbDbService} from '../../../shared/services/fb-db.service';
import {ActivatedRoute, Router} from "@angular/router";
import {map, mergeMap, Observable} from "rxjs";
import {IUser} from '../../../shared/models/IUser'
import {IProject} from "../../../shared/models/IProject";

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectInfoComponent implements OnInit{
  private fbDbService = inject(FbDbService)
  public projectInfo$!: Observable<IProject>
  public staff!: {[key: string]: IUser[]}
  public tableLength: number = 0

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.projectInfo$ = this.route.params.pipe(
      mergeMap((value) => this.fbDbService.getProjectById$(value['id'])),
      map((res) => {
        const project =  res[0].payload.doc.data()
        this.staff = {}
        for (const user of project.staff){
          Object.keys(this.staff).includes(user.companyPosition) ?
            this.staff[user.companyPosition].push(user) :
            this.staff[user.companyPosition] = [user]
        }
        return project
      })
    )
  }

  getCompanyPositions(): string[]{
    if (this.staff){
      return Object.keys(this.staff)
    }
    return []
  }

  redirectToEmployeeInfo(id: string | undefined){
    this.router.navigate(['users', id])
  }

  redirectToProjects(){
    this.router.navigate(['projects'])
  }
}
