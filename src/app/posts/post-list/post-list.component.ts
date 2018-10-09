import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'this is the first post content'},
  //   {title: 'second Post', content: 'this is the second post content'},
  //   {title: 'third Post', content: 'this is the third post content'},
  // ];
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 3, 5, 10];
  currentPage = 1;
  posts: Post[] = [];
  isLoading = false;
  private postSubscription: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postSubscription = this.postsService
      .getPostUpdateListner()
      .subscribe((postsFromObservable: {posts: Post[], postCount: number}) => {
        this.totalPosts = postsFromObservable.postCount;
        this.isLoading = false;
        this.posts = postsFromObservable.posts;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }
}
