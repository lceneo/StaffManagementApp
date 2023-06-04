import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {IUser} from "../../../shared/models/IUser";
import {FbDbService, ProjectsToken, UsersToken} from "../../../shared/services/fb-db.service";
import {IProject, IProjectFilters} from "../../../shared/models/IProject";
import {IUserDbServiceToken} from "../../../shared/interfaces/IUserDbService";

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListComponent{
  public projects: IProject[] = []
  public users$: Observable<IUser[]> = inject(UsersToken);
  public projects$: Observable<IProject[]> = inject(ProjectsToken);
  public nameFilter: FormControl = new FormControl('');
  public staffFilter: FormControl = new FormControl([]);
  public filters: IProjectFilters = {
    name: '',
    staff: []
  };
  private fbDbService = inject(FbDbService)
  public isVisiblePopUp: boolean = false
  public isVisibleEditPopUp: boolean = false
  public projectToEdit$ = new BehaviorSubject<IProject | null>(null)

  changePopUpVisibility(value: boolean, mode: 'create' | 'edit') {
    mode === 'create' ? this.isVisiblePopUp = value : this.isVisibleEditPopUp = value
  }

  addProject(value: IProject){
    this.fbDbService.addProject(value);
  }

  onEditProject(project: IProject){
    this.projectToEdit$.next(project)
    this.changePopUpVisibility(true, 'edit')
  }

  updateProject(projectId: string | undefined, updatedProject: IProject){
    this.fbDbService.updateProject(projectId, updatedProject);
  }


}
