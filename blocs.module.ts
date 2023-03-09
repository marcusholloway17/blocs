import { NgModule } from '@angular/core';
import { ContentHeaderComponent } from './content-header/content-header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { RouterModule } from '@angular/router';
import { CardsComponent } from './cards/cards.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

@NgModule({
  declarations: [
    ContentHeaderComponent,
    PageNotFoundComponent,
    CardsComponent,
    ConfirmationComponent,
  ],
  imports: [CommonModule, RouterModule, ClarityModule],
  exports: [
    ContentHeaderComponent,
    PageNotFoundComponent,
    CardsComponent,
    ConfirmationComponent,
  ],
})
export class BlocsModule {}
