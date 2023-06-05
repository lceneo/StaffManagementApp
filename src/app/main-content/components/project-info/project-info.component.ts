import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FbDbService} from '../../../shared/services/fb-db.service';
import {ActivatedRoute, Router} from "@angular/router";
import {map, mergeMap, Observable} from "rxjs";
import {CompanyPosition, IUser} from '../../../shared/models/IUser'
import {IProject} from "../../../shared/models/IProject";
import {FbEntitiesService} from "../../../shared/services/fb-entities.service";

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectInfoComponent implements OnInit{
  private fbDbService = inject(FbDbService)
  public staff$ = inject(FbEntitiesService).users$.asObservable();
  public projectInfo$!: Observable<IProject>
  public tableLength: number = 0

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.projectInfo$ = this.route.params.pipe(
      mergeMap((value) => this.fbDbService.getProjectById$(value['id'])),
      map((res) => res[0].payload.doc.data())
    )
  }

  getCompanyPositions(project: IProject, staff: IUser[]): CompanyPosition[]{
    return [...new Set(staff
      .filter(st => project.staff
        .some(s => s.id === st.id))
      .map(s => s.companyPosition))];
  }

  getStaffWithPosition(companyPosition: CompanyPosition, staff: IUser[]): IUser[] {
    return staff.filter(s => s.companyPosition === companyPosition);
  }

  redirectToEmployeeInfo(id: string | undefined){
    this.router.navigate(['users', id])
  }

  redirectToProjects(){
    this.router.navigate(['projects'])
  }
}
