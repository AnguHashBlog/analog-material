import { Component, inject, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AsyncPipe, SlicePipe } from "@angular/common";
import { Post } from "../models/post";
import { BlogService } from "../services/blog.service";
import { Observable } from "rxjs";

import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [RouterLink, MatCardModule, MatGridListModule, AsyncPipe, SlicePipe],
	template: `
		<div class="posts-view">
			<div class="cards-wrapper grid">
				@for (post of posts$ | async; track post) {
				<mat-card>
					<a [routerLink]="['post', post.slug]">
						<div class="card-image">
							<img [src]="post.coverImage.url" />
						</div>
						<div class="card-title">
							<h3>
								{{
									post.title.length > 90
										? (post.title | slice : 0 : 90) + "..."
										: post.title
								}}
							</h3>
						</div>
					</a>
				</mat-card>
				}
			</div>
		</div>
	`,
	styles: [
		`
			.posts-view {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0.5rem 0;

				.layout-control {
					display: flex;
					justify-content: flex-end;
				}

				.cards-wrapper {
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					margin: 2rem 1rem;

					mat-card {
						width: 25rem;
						margin: 1rem;
						padding: 0;
						cursor: pointer;

						&:hover {
							transform: scale(1.01);
							box-shadow: 0 4px 8px #00000033;
							transition: all 0.3s ease-in-out;
						}

						a {
							padding: 0;
							margin: 0;

							.card-image {
								width: 25rem;
								border-radius: 0.3rem;
								overflow: hidden;

								img {
									width: 100%;
									object-fit: cover;
								}
							}

							.card-title {
								padding: 0 1rem;
							}
						}
					}
				}
			}

			@media (max-width: 600px) {
				.posts-view {
					.cards-wrapper {
						width: 90vw;
						mat-card {
							width: 90%;
							margin: 0.5rem 0;
							a {
								.card-image {
									width: unset;
								}

								.card-title {
									h3 {
										font-size: 1.1rem;
									}
								}
							}
						}
					}
				}
			}
		`,
	],
})
export default class HomeComponent implements OnInit {
	blogURL!: string;
	posts$!: Observable<Post[]>;
	private blogService = inject(BlogService);

	ngOnInit() {
		this.blogURL = this.blogService.getBlogURL();
		this.posts$ = this.blogService.getPosts(this.blogURL);
	}
}
