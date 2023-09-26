import { NgModule } from "@angular/core";
import { ContentHeaderComponent } from "./content-header/content-header.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { RouterModule } from "@angular/router";
import { CardsComponent } from "./cards/cards.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { CrudComponent } from "./crud/crud.component";
import { NgxClrSmartGridModule } from "@azlabsjs/ngx-clr-smart-grid";
import { NgxSmartFormModule } from "@azlabsjs/ngx-smart-form";
import { TextEditorComponent } from "./text-editor/text-editor.component";
import { SearcherComponent } from "./searcher/searcher.component";
import { AlertComponent } from "./alert/alert.component";
import { PasswordCheckerComponent } from "./password-checker/password-checker.component";
import { ByIdPipe } from "./by-id.pipe";
import { ProfilePictureComponent } from "./profile-picture/profile-picture.component";
import { WithLoadingPipe } from "./pipes/with-loading.pipe";
// import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    ContentHeaderComponent,
    PageNotFoundComponent,
    CardsComponent,
    ConfirmationComponent,
    CrudComponent,
    TextEditorComponent,
    SearcherComponent,
    AlertComponent,
    PasswordCheckerComponent,
    ByIdPipe,
    WithLoadingPipe,
    ProfilePictureComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ClarityModule,
    NgxClrSmartGridModule.forRoot({
      pipeTransformMap: {},
    }),
    NgxSmartFormModule,
    // EditorModule,
  ],
  exports: [
    ContentHeaderComponent,
    PageNotFoundComponent,
    CardsComponent,
    ConfirmationComponent,
    CrudComponent,
    SearcherComponent,
    AlertComponent,
    PasswordCheckerComponent,
    ByIdPipe,
    WithLoadingPipe,
    ProfilePictureComponent,
  ],
})
export class BlocsModule {}
