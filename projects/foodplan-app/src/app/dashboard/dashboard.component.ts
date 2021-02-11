import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';
import { Post } from '../Post';
import { Dish } from '../Dish'
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { element } from 'protractor';

@Component({
  selector: 'appselskapet-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private dataService: DataService,
    public auth: AuthService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.mixUpTheDishesForTheWeek();
    console.log(this.dishesOfTheWeek)
  }

  makeLeftOvers: boolean = false;

  dishesOfTheWeek = [{"day":"Mandag","dish":"", "isLeftOvers": false},
  {"day":"Tirsdag", "dish":"", "isLeftOvers": false},
  {"day":"Onsdag", "dish":"", "isLeftOvers": false},
  {"day":"Torsdag", "dish":"", "isLeftOvers": false},
  {"day":"Fredag", "dish":"", "isLeftOvers": false},
  {"day":"Lørdag", "dish":"", "isLeftOvers": false},
  {"day":"Søndag", "dish":"", "isLeftOvers": false},
];

// Copying objects in js https://www.codementor.io/@junedlanja/copy-javascript-object-right-way-ohppc777d
// Shallow copy using spread syntax: dishesOfTheWeekPrev = {...this.dishesOfTheWeek};
// Deep copy using and JSON.stringify and JSON.parse
  dishesOfTheWeekPrev: any = {};

  dishesOfTheWeekRefactored = {"Mandag": {}, 
  "Tirsdag" : {},
  "Onsdag" : {},
  "Torsdag" : {},
  "Fredag" : {},
  "Lørdag" : {},
  "Søndag" : {}
};

  displayedColumns = ['date_posted', 'title', 'category', 'delete'];
  dataSource = new PostDataSource(this.dataService);
  selectedPost: Post | undefined;

  deletePost(id: number) {
    if (this.auth.isAuthenticated()) {
      this.dataService.deletePost(id);
      this.dataSource = new PostDataSource(this.dataService);
    }
    else {
        alert('Login to delete')
    }
  }

  openDialog() {
    let dialogRef = this.dialog.open(PostDialogComponent, 
      {
        width: '600px',
        data: 'Add Post'
      });
      dialogRef.componentInstance.event.subscribe((result: { data: Post; })=> {
        this.dataService.addPost(result.data);
        this.dataSource = new PostDataSource(this.dataService);
      })
  }

  viewPostDetails(post:Post) {
    this.selectedPost = post;
  }

  mixUpTheDishesForTheWeek() {
    this.dishesOfTheWeek.forEach(x => x.dish = this.dataService.getRandomDish().name)
  }

  mixUpTheDishForTheDay(day:string) {
    this.dishesOfTheWeek[this.dishesOfTheWeek.findIndex(oneDay => oneDay.day === day)].dish = this.dataService.getRandomDish().name;
    console.log(this.dishesOfTheWeek[this.dishesOfTheWeek.findIndex(oneDay => oneDay.day === day)])
  }

  setDayToLeftOvers(day:string, isChecked: boolean) {
    let dayIndex = this.dishesOfTheWeek.findIndex(oneDay => oneDay.day === day); 
    isChecked ? this.dishesOfTheWeek[dayIndex].isLeftOvers = true : this.dishesOfTheWeek[dayIndex].isLeftOvers = false;
  }

  findDish(day:string, category:string) {
    console.log(day, category);
    let dayIndex = this.dishesOfTheWeek.findIndex(oneDay => oneDay.day === day);
    this.dishesOfTheWeek[this.dishesOfTheWeek.findIndex(oneDay => oneDay.day === day)].dish = this.dataService.getRandomDish(category).name;
  }  
}

export class PostDataSource extends DataSource<any> {
  constructor(private dataService: DataService) {
    super();
  }

  connect(): Observable<Post[]> {
    return this.dataService.getData();
  }

  disconnect() {
  }
}