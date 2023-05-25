import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { RouterModule, Routes } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { SharedModule } from "../shared/shared.module";

const routes: Routes = [{
    path: '',
    component: AuthComponent
}]

@NgModule({
    declarations: [
        AuthComponent,
    ],
    imports: [
        MatIconModule,
        RouterModule.forChild(routes),
        SharedModule,
    ]
})
export class AuthModule {}