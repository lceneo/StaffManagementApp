import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Event, Router} from "@angular/router";
import {FbDbService} from "../../../shared/services/fb-db.service";
import {IProject} from "../../../shared/models/IProject";
import {IUser} from "../../../shared/models/IUser";

@Component({
  selector: 'app-project-item[project]',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent{
  @Input() project!: IProject;
  @Input() users!: IUser[];
  @Output() editProjectEvent = new EventEmitter()
  private router = inject(Router);
  private fbDbService = inject(FbDbService)
  public page: number = 0

  pageIncrement(event: MouseEvent){
    event.stopPropagation()
    ++this.page
  }

  pageDecrement(event: MouseEvent){
    event.stopPropagation()
    --this.page
  }

  redirectToProjectInfo(id: string | undefined){
    this.router.navigate(['projects', this.project.id])
  }

  redirectToEmployeeInfo(id: string | undefined){
    this.router.navigate(['users', id]);
  }

  onEdit(event: MouseEvent, project: IProject){
    event.stopPropagation()
    this.editProjectEvent.emit(project)
  }

  onDelete(event:MouseEvent, id: string | undefined){
    event.stopPropagation()
    if (id){
      this.fbDbService.deleteProject(id)
    }
  }
}
