import { Component, OnInit } from '@angular/core';
import { TaskI } from '../../models/task.interface'
import { TodoService } from '../../services/todo.service'
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular'

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {

  todo: TaskI = {
    task: '',
    priority: ''
  };
  todoId = null;

  constructor(private route: ActivatedRoute, 
              private nav:NavController, 
              private todoService: TodoService,
              private loadingController: LoadingController) { }

  ngOnInit() {
    this.todoId = this.route.snapshot.params['id'];
    if (this.todoId) {
      this.loadToDo();
    }
  }

  async loadToDo() {
    const loading = await this.loadingController.create({
      message: 'Loading....'
    });
    await loading.present();
    this.todoService.getTodo(this.todoId).subscribe(res => {
      loading.dismiss();
      this.todo = res;
    })
  }

  async saveToDo() {
    const loading = await this.loadingController.create({
      message: 'Saving....'
    });
    await loading.present();
    if (this.todoId) {
      //Update
      this.todoService.updateTodo(this.todo, this.todoId).then(() => {
        loading.dismiss();
        this.nav.navigateForward('/')
      });
    }
    else {
      //Add New
      this.todoService.addTodo(this.todo).then(() => {
        loading.dismiss();
        this.nav.navigateForward('/')
      });
    }
  }

  onRemove(idTodo: string) {
    this.todoService.removeTodo(idTodo);
  }

}
