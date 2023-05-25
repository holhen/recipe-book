import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";
import { DropdownDirective } from "./dropdown.directive";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        AlertComponent,
        DropdownDirective,
        PlaceholderDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule
    ],
    exports: [
        AlertComponent,
        CommonModule,
        DropdownDirective,
        FormsModule,
        PlaceholderDirective,
    ]
})
export class SharedModule {}