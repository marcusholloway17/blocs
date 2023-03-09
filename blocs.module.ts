import { NgModule } from '@angular/core';
import { ContentHeaderComponent } from './content-header/content-header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { RouterModule } from '@angular/router';
import { CardsComponent } from './cards/cards.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { CrudComponent } from './crud/crud.component';
import { NgxClrSmartGridModule } from '@azlabsjs/ngx-clr-smart-grid';
import { NgxSmartFormModule } from '@azlabsjs/ngx-smart-form';
import { TextEditorComponent } from './text-editor/text-editor.component';
// import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    ContentHeaderComponent,
    PageNotFoundComponent,
    CardsComponent,
    ConfirmationComponent,
    CrudComponent,
    TextEditorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ClarityModule,
    NgxClrSmartGridModule,
    NgxSmartFormModule,
    // EditorModule,
  ],
  exports: [
    ContentHeaderComponent,
    PageNotFoundComponent,
    CardsComponent,
    ConfirmationComponent,
    CrudComponent,
  ],
})
export class BlocsModule {}
