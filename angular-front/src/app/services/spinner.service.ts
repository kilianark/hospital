import { Injectable, signal } from "@angular/core";

@Injectable ({providedIn: 'root'})
export class SpinnerService {

isLoading = signal<boolean>(false);


public hide() {
    this.isLoading.set(false);
    console.log("hide");
}

public show() {
    this.isLoading.set(true);
    console.log("show");
}
}
