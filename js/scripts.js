"use strict";

document.addEventListener("DOMContentLoaded", () => {
	// ===================================== HEADER =============================================

	// burger
	(() => {

		function setBurger(params) {
			const btn = document.querySelector(`.${params.btnClass}`);
			const menu = document.querySelector(`.${params.menuClass}`);
			const links = menu.querySelectorAll(`.${params.linksClass}`);

			function onBtnClick() {

				if (window.getWindowWidth() < window.TABLET_WIDTH) {
					btn.classList.toggle(params.activeClass);

					if (
						!menu.classList.contains(params.activeClass) &&
						!menu.classList.contains(params.hiddenClass)
					) {
						menu.classList.add(params.activeClass);
						document.body.style.overflow = "hidden";
						btn.setAttribute("aria-label", "Закрыть главное меню");
					} else {
						menu.classList.add(params.hiddenClass);
						document.body.removeAttribute("style");
						btn.classList.toggle(params.hiddenClass);
						btn.setAttribute("aria-label", "Открыть главное меню");
					}
				}
			}

			menu.addEventListener("animationend", function () {
				if (this.classList.contains(params.hiddenClass)) {
					this.classList.remove(params.activeClass);
					this.classList.remove(params.hiddenClass);
					btn.classList.remove(params.hiddenClass);
				}
			});

			btn.addEventListener("click", window.debounce(onBtnClick, 500));
			links.forEach(link => {
				link.addEventListener('click', window.debounce(onBtnClick, 500));
			});
		}

		// здесь мы вызываем функцию и передаем в нее классы наших элементов
		setBurger({
			btnClass: "js-burger", // класс бургера
			menuClass: "js-nav", // класс меню
			activeClass: "is-opened", // класс открытого состояния
			hiddenClass: "is-closed", // класс закрывающегося состояния (удаляется сразу после закрытия)
			linksClass: "js-nav-link",
		});
	})();

	// dropdown
	(() => {
		const params = {
			btnClassName: "dropdown__button",
			dropClassName: "dropdown__content",
			activeClassName: "is-active",
			disabledClassName: "is-disabled",
		};

		function onDisable(evt) {
			if (evt.target.classList.contains(params.disabledClassName)) {
				evt.target.classList.remove(
					params.disabledClassName,
					params.activeClassName
				);
				evt.target.removeEventListener("animationend", onDisable);
			}
		}

		function setMenuListener() {
			document.body.addEventListener("click", (evt) => {
				const activeElements = document.querySelectorAll(
					`.${params.btnClassName}.${params.activeClassName}, .${params.dropClassName}.${params.activeClassName}`
				);

				if (
					activeElements.length &&
					!evt.target.closest(`.${params.activeClassName}`)
				) {
					activeElements.forEach((current) => {
						if (current.classList.contains(params.btnClassName)) {
							current.classList.remove(params.activeClassName);
						} else {
							current.classList.add(params.disabledClassName);
						}
					});
				}

				if (evt.target.closest(`.${params.btnClassName}`)) {
					const btn = evt.target.closest(`.${params.btnClassName}`);
					const path = btn.dataset.path;
					const drop = document.querySelector(
						`.${params.dropClassName}[data-target="${path}"]`
					);

					btn.classList.toggle(params.activeClassName);

					if (!drop.classList.contains(params.activeClassName)) {
						drop.classList.add(params.activeClassName);
						drop.addEventListener("animationend", onDisable);
					} else {
						drop.classList.add(params.disabledClassName);
					}
				}
			});
		}

		setMenuListener();
	})();

	// search
	(() => {
		function setSearch(params) {
			const openBtn = document.querySelector(`.${params.openBtnClass}`);
			const search = document.querySelector(`.${params.searchClass}`);
			const closeBtn = search.querySelector(`.${params.closeBtnClass}`);

			search.addEventListener("animationend", function (evt) {
				if (this._isOpened) {
					this.classList.remove(params.activeClass);
					this.classList.remove(params.hiddenClass);
					this._isOpened = false;
				} else {
					this._isOpened = true;
				}
			});

			search.addEventListener("click", function (evt) {
				evt._isSearch = true;
			});

			openBtn.addEventListener("click", function (evt) {
				this.disabled = true;
				this.style.opacity = 0;

				if (
					!search.classList.contains(params.activeClass) &&
					!search.classList.contains(params.hiddenClass)
				) {
					search.classList.add(params.activeClass);
				}
			});

			closeBtn.addEventListener("click", function () {
				openBtn.disabled = false;
				openBtn.style.opacity = "";
				search.classList.add(params.hiddenClass);
			});

			document.body.addEventListener("click", function (evt) {
				if (!evt._isSearch && search._isOpened) {
					openBtn.disabled = false;
					openBtn.style.opacity = "";
					search.classList.add(params.hiddenClass);
				}
			});
		}

		setSearch({
			openBtnClass: "js-open-search", // класс кнопки открытия
			closeBtnClass: "js-close-search", // класс кнопки закрытия
			searchClass: "js-search-form", // класс формы поиска
			activeClass: "is-opened", // класс открытого состояния
			hiddenClass: "is-closed", // класс закрывающегося состояния (удаляется сразу после закрытия)
		});
	})();

	// scroll

	function scrollToContent (link, isMobile) {
		if (isMobile && window.getWindowWidth() > window.MOBILE_WIDTH) {
			return;
		}

		let href = link.getAttribute('href') || link.getAttribute('data-href');
		href = href.substring(1);

		if(href) {
			const scrollTarget = document.getElementById(href);
			const elementPosition = scrollTarget.getBoundingClientRect().top;

			window.scrollBy({
					top: elementPosition,
					behavior: 'smooth'
			});
		}
	}

	document.querySelectorAll('.js-scroll-link').forEach(link => {
		link.addEventListener('click', function(e) {
				e.preventDefault();

				scrollToContent(this, false);
		});
	});

	// ============================================ HERO ===============================================

	// swiper
	(() => {
		const heroSlider = new Swiper(".js-hero-slider", {
			allowTouchMove: false,
			slidesPerView: 1,
			loop: true,
			effect: "fade",
			speed: 10000,
			autoplay: {
				delay: 10000,
			},
		});
	})();

	// ============================================= GALLERY ===========================================

	(() => {
		// select
		const galleryChoicesSelect = document.querySelector(".js-gallery-choices");
		const galleryChoices = new Choices(galleryChoicesSelect, {
			searchEnabled: false,
			shouldSort: false,
			itemSelectText: "",
			position: "bottom",

			classNames: {
				containerOuter: "filter-choices",
				containerInner: "filter-choices__inner",
				input: "filter-choices__input",
				inputCloned: "filter-choices__input--cloned",
				list: "filter-choices__list",
				listItems: "filter-choices__list--multiple",
				listSingle: "filter-choices__list--single",
				listDropdown: "filter-choices__list--dropdown",
				item: "filter-choices__item",
				itemSelectable: "filter-choices__item--selectable",
				itemDisabled: "filter-choices__item--disabled",
				itemChoice: "filter-choices__item--choice",
				placeholder: "filter-choices__placeholder",
				group: "filter-choices__group",
				groupHeading: "filter-choices__heading",
				button: "filter-choices__button",
				activeState: "is-active",
				focusState: "is-focused",
				openState: "is-open",
				disabledState: "is-disabled",
				highlightedState: "is-highlighted",
				selectedState: "is-selected",
				flippedState: "is-flipped",
				loadingState: "is-loading",
				noResults: "has-no-results",
				noChoices: "has-no-choices",
			},
		});

		// swiper
		const gallerySlider = new Swiper(".js-gallery-slider", {
			slidesPerView: 1,
			grid: {
				rows: 1,
				fill: "row"
			},
			spaceBetween: 20,
			pagination: {
				el: ".js-gallery-pagination",
				type: "fraction",
			},
			navigation: {
				nextEl: ".js-gallery-next",
				prevEl: ".js-gallery-prev",
				disabledClass: "nav-btn--disabled",
			},

			breakpoints: {
				421: {
					slidesPerView: 2,
					grid: {
						rows: 2
					},
					slidesPerGroup: 3,
					spaceBetween: 30,
				},

				1281: {
					slidesPerView: 3,
					grid: {
						rows: 2
					},
					slidesPerGroup: 3,
					spaceBetween: 50,
				},
			},

			a11y: false,
			keyboard: true, // можно управлять с клавиатуры стрелками влево/вправо

			// Дальнейшие надстройки делают слайды вне области видимости не фокусируемыми
			watchSlidesProgress: true,
			watchSlidesVisibility: true,
			slideVisibleClass: "slide-visible",

			on: {
				init: function () {
					this.slides.forEach((slide) => {
						if (!slide.classList.contains("slide-visible")) {
							slide.tabIndex = "-1";
						} else {
							slide.tabIndex = "";
						}
					});
				},
				slideChange: function () {
					this.slides.forEach((slide) => {
						if (!slide.classList.contains("slide-visible")) {
							slide.tabIndex = "-1";
						} else {
							slide.tabIndex = "";
						}
					});
				},
			},

		});
	})();

	// =========================================== CATALOG =============================================

	(() => {

		function setTabs(dataPath, dataTarget) {
			const btns = document.querySelectorAll(`.js-tab-btn[${dataPath}]`);


			btns.forEach((btn) => {
				btn.addEventListener("click", function (evt) {
					const wrap = this.closest('.js-tab-wrap');
					const contents = wrap.querySelectorAll(
						`.js-tab-content[${dataTarget}]`
					);
					const path = this.getAttribute(dataPath);
					console.log(path);
					const target = document.querySelector(
						`.js-tab-content[${dataTarget}="${path}"]`
					);

					btns.forEach((currentBtn) => {
						currentBtn.classList.remove("is-active");
					});

					this.classList.add("is-active");

					contents.forEach((content) => {
						content.classList.remove("is-active");
					});

					target.classList.add("is-active");
				});
			});
		}

		setTabs("data-country-path", "data-country-target");
		setTabs("data-painter-path", "data-painter-target");

		// accordion
		$(function () {
			const countries = [
				"#accordion-france",
				"#accordion-germany",
				"#accordion-italy",
				"#accordion-russia",
				"#accordion-belgium",
			];
			countries.forEach(function (id) {
				$(id).accordion({
					collapsible: true,
					active: 0,
					// icons: false,
					heightStyle: "content",
				});
			});
		});
	})();

	// ============================================= EVENTS =================================================

	(() => {
		const DESKTOP_WIDTH = 971;
		const eventsBtn = document.getElementById("events-button");

		const sliderMobileParams = {
			paginationClassName: "events__pagination",
			cardsContainerName: "events__slider-container",
			cardsWrapName: "events__slider-wrapper",
			card: "events__article",
			hiddenClass: "is-hidden",
		};

		function activateMobileSlider(params) {
			const pagination = document.createElement("div");
			pagination.classList.add(params.paginationClassName);
			params.cardsContainer.append(pagination);

			console.log(params.cardsContainer);

			params.cardsContainer.classList.add("swiper-container");
			params.cardsWrap.classList.add("swiper-wrapper");

			params.cardsSlider = new Swiper(`.${params.cardsContainerName}`, {
				slidesPerView: 1,
				spaceBetween: 20,
				pagination: {
					el: `.${params.cardsContainerName} .${params.paginationClassName}`,
				},

				on: {
					beforeInit() {
						document.querySelectorAll(`.${params.card}`).forEach((el) => {
							el.classList.add("swiper-slide");
						});
					},

					beforeDestroy() {
						this.slides.forEach((el) => {
							el.classList.remove("swiper-slide");
							el.removeAttribute("role");
							el.removeAttribute("aria-label");
						});

						this.pagination.el.remove();
					},
				},
			});
		}

		function destroyMobileSlider(params) {
			params.cardsSlider.destroy();
			params.cardsContainer.classList.remove("swiper-container");
			params.cardsWrap.classList.remove("swiper-wrapper");
			params.cardsWrap.removeAttribute("aria-live");
			params.cardsWrap.removeAttribute("id");
		}

		function setHiddenCards(params, windowWidth) {
			const cards = document.querySelectorAll(`.${params.card}`);
			let quantity = cards.length;

			if (windowWidth > window.MOBILE_WIDTH && windowWidth < DESKTOP_WIDTH) {
				quantity = 2;
			}

			if (windowWidth >= DESKTOP_WIDTH) {
				quantity = 3;
			}

			cards.forEach((card, i) => {
				card.classList.remove(params.hiddenClass);
				if (i >= quantity) {
					card.classList.add(params.hiddenClass);
				}
			});
		}

		function showCards(e) {
			const cards = document.querySelectorAll(`.${sliderMobileParams.card}`);

			e.target.style = "display: none";

			cards.forEach((card) => {
				card.classList.remove(sliderMobileParams.hiddenClass);
			});
		}

		function checkWindowWidthMobile(params) {
			const currentWidth = window.getWindowWidth();
			eventsBtn.style = "";
			params.cardsContainer = document.querySelector(
				`.${params.cardsContainerName}`
			);
			params.cardsWrap = document.querySelector(`.${params.cardsWrapName}`);

			if (
				currentWidth <= window.MOBILE_WIDTH &&
				(!params.cardsSlider || params.cardsSlider.destroyed)
			) {
				activateMobileSlider(params);
			} else if (currentWidth > window.MOBILE_WIDTH && params.cardsSlider) {
				destroyMobileSlider(params);
			}

			setHiddenCards(params, currentWidth);
		}

		checkWindowWidthMobile(sliderMobileParams);
		eventsBtn.addEventListener("click", showCards);

		window.addEventListener("resize", function () {
			checkWindowWidthMobile(sliderMobileParams);
		});
	})();

	//  ================================= EDITIONS =========================================

	(() => {
		// Checkboxes
		const checkBtn = document.querySelector(".js-checkbox-title");

		checkBtn.addEventListener("click", function () {
			this.classList.toggle("is-active");
		});

		// Slider
		const sliderParamsNotMobile = {
			sliderWrap: "js-editions-slider",
			cardsContainerName: "js-slider",
			cardsWrapName: "js-slides-wrap",
			card: "slide",
			paginationClassName: "editions__pagination",
			navClassName: "editions__slider-nav",
			navBtnClassName: "nav-btn",
			navPrev: "nav-btn--prev",
			navNext: "nav-btn--next",
			disabledClass: "nav-btn--disabled",
		};

		function activateSlider(params) {
			const navigation = document.createElement("div");
			const pagination = document.createElement("div");
			const navBtnPrev = document.createElement("button");
			const navBtnNext = document.createElement("button");

			navigation.classList.add(params.navClassName);

			navBtnPrev.classList.add(params.navBtnClassName);
			navBtnPrev.classList.add(params.navPrev);
			navigation.prepend(navBtnPrev);

			pagination.classList.add(params.paginationClassName);
			navigation.append(pagination);

			navBtnNext.classList.add(params.navBtnClassName);
			navBtnNext.classList.add(params.navNext);
			navigation.append(navBtnNext);

			params.sliderWrapElem.prepend(navigation);

			params.cardsContainer.classList.add("swiper-container");
			params.cardsWrap.classList.add("swiper-wrapper");

			params.cardsSlider = new Swiper(`.${params.cardsContainerName}`, {
				breakpoints: {
					640: {
						slidesPerView: 2,
						spaceBetween: 35,
					},
					769: {
						slidesPerView: 2,
						spaceBetween: 50,
					},
					1281: {
						slidesPerView: 3,
						spaceBetween: 50,
					},
				},

				pagination: {
					el: `.${params.sliderWrap} .${params.paginationClassName}`,
					type: "fraction",
				},

				navigation: {
					nextEl: `.${params.navNext}`,
					prevEl: `.${params.navPrev}`,
					disabledClass: `${params.disabledClass}`,
				},

				on: {
					beforeInit() {
						document.querySelectorAll(`.${params.card}`).forEach((el) => {
							el.classList.add("swiper-slide");
						});
					},

					beforeDestroy() {
						this.slides.forEach((el) => {
							el.classList.remove("swiper-slide");
							el.removeAttribute("role");
							el.removeAttribute("aria-label");
						});

						this.pagination.el.remove();
						navigation.remove();
					},
				},
			});
		}

		function destroySlider(params) {
			params.cardsSlider.destroy();
			params.cardsContainer.classList.remove("swiper-container");
			params.cardsWrap.classList.remove("swiper-wrapper");
			params.cardsWrap.removeAttribute("aria-live");
			params.cardsWrap.removeAttribute("id");
		}

		function checkWindowWidth(params) {
			const currentWidth = window.getWindowWidth();
			params.sliderWrapElem = document.querySelector(`.${params.sliderWrap}`);
			params.cardsContainer = document.querySelector(
				`.${params.cardsContainerName}`
			);
			params.cardsWrap = document.querySelector(`.${params.cardsWrapName}`);

			if (
				currentWidth > window.MOBILE_WIDTH &&
				(!params.cardsSlider || params.cardsSlider.destroyed)
			) {
				activateSlider(params);
			} else if (currentWidth <= window.MOBILE_WIDTH && params.cardsSlider) {
				destroySlider(params);
			}
		}

		checkWindowWidth(sliderParamsNotMobile);

		window.addEventListener("resize", function () {
			checkWindowWidth(sliderParamsNotMobile);
		});
	})();

	// ================================== PROJECTS =================================================

	// tooltip

	tippy(".js-tooltip", {
		theme: "main-theme",
	});

	//  swiper
	const projectsSlider = new Swiper(".js-partners-slider", {
		// loop: true,
		slidesPerView: 1,
		spaceBetween: 20,
		navigation: {
			nextEl: ".js-partners-next",
			prevEl: ".js-partners-prev",
			disabledClass: "nav-btn--disabled",
		},

		breakpoints: {
			641: {
				slidesPerView: 2,
				spaceBetween: 34,
			},

			971: {
				slidesPerView: 2,
				spaceBetween: 50,
			},

			1281: {
				slidesPerView: 3,
				spaceBetween: 50,
			},
		},

		a11y: false,

	});

	//  ====================================== CONTACTS ============================================

	(() => {

	// Mask

  const selector = document.querySelector("input[type='tel']");

  const im = new Inputmask("+7 (999)-999-99-99");
  im.mask(selector);

  // Validate

  new JustValidate('.info__form', {
    rules: {
      name: {
        required: true,
        minLength: 2,
        maxLength: 30
      },
      tel: {
        required: true,
        function: () => {
          const phone = selector.inputmask.unmaskedvalue();
          return Number(phone) && phone.length === 10;
        }
      },
    },
    messages: {
      name: {
        required: 'Как вас зовут?'
      },
      tel: {
        required: 'Укажите ваш телефон'
      },
    },
    colorWrong: '#D11616',

		submitHandler: function(form) {
			let formData = new FormData(form);

			fetch('mail.php', {
				method: 'POST',
				body: formData
			}).then(() => {
				console.log('Отправлено');
				form.reset();
			})
			.catch(() => console.log('Ошибка'));
		}
  });


		// yandex-map
		ymaps.ready(init);
		function init() {
			const myMap = new ymaps.Map(
				"map",
				{
					center: [55.76, 37.64],
					zoom: 14,

					controls: ["geolocationControl", "zoomControl"],
				},
				{
					suppressMapOpenBlock: true,
					geolocationControlSize: "large",
					geolocationControlPosition: { top: "200px", right: "20px" },
					geolocationControlFloat: "none",
					zoomControlSize: "small",
					zoomControlFloat: "none",
					zoomControlPosition: { top: "120px", right: "20px" },
				}
			);

			const myPlacemark = new ymaps.Placemark(
				[55.758468, 37.601088],
				{
					hintContent: "Посмотреть локацию",
					balloonContent: "Галерея BLANCHARD Шоурум №4",
				},
				{
					iconLayout: "default#imageWithContent",
					iconImageHref: "../assets/img/contacts/pin.svg",
					iconImageSize: [20, 20],
				}
			);
			myMap.geoObjects.add(myPlacemark);
		}

	})();

	// =============================================== MODAL =========================================

	(() => {
		const body = document.querySelector('.body');
		const modalsOverlay = document.querySelector('.modals-overlay');
		const modalLinks = document.querySelectorAll('.gallery__modal-link')
		const modals = document.querySelectorAll('.modal');
		const modalBtnsClose = document.querySelectorAll('.modal__btn-close');

		modalLinks.forEach((el) => {
			el.addEventListener('click', (e) => {
				e.preventDefault();
				const path = e.currentTarget.getAttribute('data-path');
				console.log(path);

				modals.forEach((el) => {
					el.classList.remove('modal--visible');
				});

				document.querySelector(`[data-target=${path}]`).classList.add('modal--visible');
				modalsOverlay.classList.add('modals-overlay--visible');
				body.classList.add('lock');
			});
		});

		modalsOverlay.addEventListener('click', (e) => {
			console.log(e.target)
			if(e.target == modalsOverlay) {
				modals.forEach((el) => {
					el.classList.remove('modal--visible');
				});
				modalsOverlay.classList.remove('modals-overlay--visible');
				body.classList.remove('lock');
			}
		});


		modalBtnsClose.forEach((el) => {
			el.addEventListener('click', (e) => {
				modals.forEach((el) => {
					el.classList.remove('modal--visible');
				});
				modalsOverlay.classList.remove('modals-overlay--visible');
				body.classList.remove('lock');
			});
		})
	})();


	// конец обработчика загрузки страницы
});
