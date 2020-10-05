var app = new Vue({
	el: '#app',
	data: {
		inputText: '',
		tempText: '',
		outputText: 'Mätin eńgizińiz',
		abc: {
			'ц': 's', 'Ц': 'S', 
			'щ': 'sh', 'Щ': 'Sh',
			'а': 'a', 'А': 'A',
			'ә': 'ä', 'Ә': 'Ä',
			'б': 'b', 'Б': 'B',
			'ш': 'c', 'Ш': 'C',
			'ч': 'ç', 'Ч': 'Ç',
			'д': 'd', 'Д': 'D',
			'е': 'e', 'Е': 'E',
			'ё': 'ó', 'Ё': 'Ó',
			'э': 'e', 'Э': 'E',
			'ф': 'f', 'Ф': 'F',
			'г': 'g', 'Г': 'G',
			'ғ': 'ğ', 'Ғ': 'Ğ',
			'х': 'h', 'Х': 'H',
			'һ': 'h', 'Һ': 'H',
			'и': 'ı', 'И': 'I',
			'й': 'ı', 'Й': 'I',
			'і': 'i', 'І': 'İ',
			'ж': 'j', 'Ж': 'J',
			'к': 'k', 'К': 'K',
			'қ': 'q', 'Қ': 'Q',
			'л': 'l', 'Л': 'L',
			'м': 'm', 'М': 'M',
			'н': 'n', 'Н': 'N',
			'ң': 'ń', 'Ң': 'Ń',
			'о': 'o', 'О': 'O',
			'ө': 'ö', 'Ө': 'Ö',
			'п': 'p', 'П': 'P',
			'р': 'r', 'Р': 'R',
			'с': 's', 'С': 'S',
			'т': 't', 'Т': 'T',
			'у': 'u', 'У': 'U',
			'ұ': 'ú', 'Ұ': 'Ú',
			'ю': 'ú', 'Ю': 'Ú',
			'ү': 'ü', 'Ү': 'Ü',
			'в': 'v', 'В': 'V',
			'ы': 'y', 'Ы': 'Y',
			'з': 'z', 'З': 'Z',
			'я': 'á', 'Я': 'Á',
			' ': ' ', 'ъ': '', 'Ъ': '', 'ь': '', 'Ь': ''
		}
	},
	methods: {
		translit: function () {
			if (this.inputText.length > 0) {
				let mess = this.inputText.replace(/сц/, 's').replace(/Сц/, 'S').replace(/СЦ/, 'S').replace(/сЦ/, 's');
				mess = mess.replace(/ия/, 'ıa').replace(/Ия/, 'Ia').replace(/ИЯ/, 'IA').replace(/иЯ/, 'ıa');
				for (var i = 0; i < mess.length; i++) {
					this.tempText += (this.abc[mess.charAt(i)]) ? this.abc[mess.charAt(i)] : mess.charAt(i);
				}
				this.outputText = this.tempText;
				this.tempText = '';
			} else {
				this.outputText = 'Mätin eńgizińiz';
			}
		},
		clear: function () {
			this.tempText = '';
			this.inputText = '';
			this.outputText = 'Mätin eńgizińiz';
		}
	}
})