
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { SuperDatePickerComponent } from './super-date-picker/super-date-picker.component';
import { FormsModule } from '@angular/forms';
import { MoreInfoComponent } from './more-info/more-info.component';
import { MessagerComponent } from './messager/messager.component';
import { LoaderService } from './loader.service';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    MessagerComponent,
    SuperDatePickerComponent,
    MoreInfoComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatTabsModule,
    MatCardModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [LoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
