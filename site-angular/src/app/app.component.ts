import { Component, ElementRef, Inject, OnInit, OnDestroy, Renderer2, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PantherConfigService } from '@panther/services/config.service';
import { PantherSplashScreenService } from '@panther/services/splash-screen.service';


@Component({
    selector: 'panther-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
    pantherConfig: any;
    navigation: any;

    private _unsubscribeAll: Subject<any>;


    constructor(
        private pantherSplashScreen: PantherSplashScreenService,
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private pantherConfigService: PantherConfigService,
        private platform: Platform,
        @Inject(DOCUMENT) private document: any
    ) {

        if (this.platform.ANDROID || this.platform.IOS) {
            this.document.body.className += ' is-mobile';
        }

        this._unsubscribeAll = new Subject();

    }

    ngOnInit(): void {
        this.pantherConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.pantherConfig = config;
            });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


    addClass(className: string) {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string) {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
}
