function teemboom_comments_load(theme=false){
	let page_url = `commentMOCK`;
	let theme_url = 'https://comment-themes.teemboom.com'
	let comments_api = 'https://comments.teemboom.com'
	let config;

	fetch(`${comments_api}/teemboom_config`, {
		'headers': {'Content-type': 'application/json'},
		'method': 'POST',
		'body': JSON.stringify({'page_id': page_url})
	})
	.then(res=>{return res.json()})
	.then(response=>{
		if (!response.status) return
		config = response.data
		config.comments_api = comments_api
		if (theme){
			config.theme = theme
		}
		let theme_css = document.createElement('link')
		theme_css.setAttribute('href', `${theme_url}/${config.theme}/teemboom_theme.css`)
		theme_css.setAttribute('rel', 'stylesheet')
		theme_css.setAttribute('id', 'teemboom_css')
		document.head.appendChild(theme_css)

		let theme_js = document.createElement('script');
		theme_js.setAttribute('id', 'teemboom_js')
		theme_js.onload = ()=>{
			teemboom_app(config)
		}
		theme_js.setAttribute('src',`${theme_url}/${config.theme}/teemboom_app.js`)
		document.head.appendChild(theme_js);		
	})
}


class teemboomCommentsClass{
	constructor(obj){
		this.config = obj.config
		this.populate = obj.populate
		this.add_comment = obj.add_comment
		this.main_profile_id = obj.main_profile_id
		this.like_number_class = obj.like_number_class
		this.dislike_number_class = obj.dislike_number_class
		this.load()
	}

	page_url = `commentMOCK`;
	socket = false;
	send_text;
	comments_box;
	metrics_box;
	comments_no = 0;
	main_div;
	session_id = null
	user = false
	comments_api = 'https://comments.teemboom.com'
	auth_api = 'https://auth.teemboom.com'
	default_hex = ["FFCC66", "99CCCC", "FF6666", "CC99FF", "4285F4", "FF6666", "66CCCC", "FF9966", "5555FF", "66CC99"]

	load(){

		this.main_div = document.getElementById('teemboom_comments')
		if (this.main_div){
			this.main_div.className = 'teemboom_root'
		}else if (document.getElementById('teemboom_popup')){
			let popup_button = document.getElementById('teemboom_popup')
			let cover_div;
			let cover_div_state = false
			const popup_toogle = ()=>{
				if (cover_div_state) {cover_div.style.display = 'none'; cover_div_state = false}
				else {cover_div.style.display = 'block'; cover_div_state = true}
			}
			popup_button.addEventListener('click', popup_toogle)
			cover_div = document.createElement('section')
			cover_div.id = 'teemboom_comments_popup'
			cover_div.className = 'teemboom_root'
			let popup_close = document.createElement('div')
			popup_close.id = 'teemboom_popup_close'
			popup_close.innerHTML = '<p>X</p>'
			popup_close.addEventListener('click', popup_toogle)
			cover_div.appendChild(popup_close)
			this.main_div = document.createElement('div')
			this.main_div.id = 'teemboom_comments'
			cover_div.appendChild(this.main_div)
			document.body.appendChild(cover_div)
		}
		else{
			this.main_div = document.createElement('section')
			this.main_div.id = 'teemboom_comments'
			this.main_div.className = 'teemboom_root'
			document.body.appendChild(this.main_div)
		}
		this.admin_config()
		this.populate()
		this.initial_identification()

	}

	admin_config(){	
		let style_rule = '.teemboom_root{'
		let mainColors = this.config.style.colors.main
		for (let style in mainColors){
			style_rule += `--teemboom-${style}: ${mainColors[style]};`
		}
		let font = this.config.style.font.normal
		for (let style in font){
			let px = ''
			if (style == 'font_size') px = 'px'
			style_rule += `--teemboom-${style}: ${font[style]}${px};`
		}
		style_rule += '}'
		
		let styleElement = document.createElement('style')
		styleElement.appendChild(document.createTextNode(style_rule))
		document.head.appendChild(styleElement)
		if (this.config.live_chat) {
			this.live_chat()
		}
	}

	getComments(){
		fetch(`${this.comments_api}/teemboom_comments`, {
			'headers': {'Content-type': 'application/json'},
			'method': 'POST',
			'body': JSON.stringify({'page_id': this.page_url})
		})
		.then(res=>{return res.json()})
		.then(json=>{
			if (!json.status) return
			for (let data of json.data){
				this.add_comment(data)
			}
		})
	}

	getCommentChildren(parent_id){
		fetch(`${this.comments_api}/get_nested_comments`, {
			'headers': {'Content-type': 'application/json'},
			'method': 'POST',
			'body': JSON.stringify({'parent_id': parent_id})
		})
		.then(res=>{return res.json()})
		.then(json=>{
			if (!json.status) return
			for (let data of json.data){
				this.add_comment(data)
			}
		})
	}

	submit_comment(inputElement, parent_id=null){
		let comment = inputElement.value
		if (comment == '' || /[A-Za-z0-9]/.test(comment) == false || comment.length > 1000) return;
		let user = this.get_user()
		if (!user) return
		inputElement.value = ''
		fetch(`${this.comments_api}/new_comment`, {
			'headers': {'Content-type': 'application/json'},
			'method': 'POST',
			'body': JSON.stringify({
				'content': comment, 
				'user': user,
				'page_id': this.page_url,
				'parent_id': parent_id
			})
		})
		.then((res)=>{return res.json()})
		.then((json)=>{
			if (!json.status) return
			if (this.config.live_chat){
				this.socket.emit('spread_comment', {'room': this.page_url, 'comment': json.data})
			}else{
				if (this.config.auth_comments) {
					let markup = [
						['header', 'Thank you! <br><br> Your comment has been submitted and will be reviewed.'],
					]
					this.new_popup(markup)
				}
				else this.add_comment(json.data)
			}
		})
	}

	like_comment(comment_id){
		let user = this.get_user()
		if (!user) return
		fetch(`${this.comments_api}/like_comment`, {
			'headers': {'Content-type': 'application/json'},
			'method': 'POST',
			'body': JSON.stringify({
				'user_id': user._id,
				'comment_id': comment_id
			})
		})
		.then(res=>{return res.json()})
		.then(json=>{
			if (!json.status) return
			if (this.config.live_chat){
				this.socket.emit('spread_like', {'room': this.page_url, 'data': json.data})
			}else{
				this.add_like(json.data)
			}
		})
	}

	dislike_comment(comment_id){
		let user = this.get_user()
		if (!user) return
		fetch(`${this.comments_api}/dislike_comment`, {
			'headers': {'Content-type': 'application/json'},
			'method': 'POST',
			'body': JSON.stringify({
				'user_id': user._id,
				'comment_id': comment_id
			})
		})
		.then(res=>{return res.json()})
		.then(json=>{
			if (!json.status) return
			if (this.config.live_chat){
				this.socket.emit('spread_dislike', {'room': this.page_url, 'data': json.data})
			}else{
				this.add_dislike(json.data)
			}
		})
	}

	add_like(data){
		let comment = document.getElementById(data.comment_id)	
		let likes = comment.querySelector('.' + this.like_number_class)
		if (data.action == 1){
			likes.innerText = Number(likes.innerText) + 1
		}else{
			likes.innerText = Number(likes.innerText) - 1
		}
	}

	add_dislike(data){
		let comment = document.getElementById(data.comment_id)	
		let dislikes = comment.querySelector('.' + this.dislike_number_class)
		if (data.action == 1){
			dislikes.innerText = Number(dislikes.innerText) + 1
		}else{
			dislikes.innerText = Number(dislikes.innerText) - 1
		}
	}

	
	profile_dropdown(){
		let markup = [
			['div', false, {'id': 'teemboom_profile_popup_pfp'}],
			['h6', this.user ? this.user.username : '', false],
			['button', 'Log Out', {'onclick': ()=>{
				this.logout()
			}}]
		]
		if (!this.user || !this.user.username){
			// if (this.config.identification == 3){
			// 	markup[1][1] = 'Anonymous. No authentication requried'
			// 	markup.pop()
			// }else{}
			markup[1][1] = 'Not Signed in'
			markup[2] = ['button', 'Sign in', {'onclick': ()=>{
				this.get_user()
			}}];
			
		}
		this.new_popup(markup)
		if (this.user.profile_pic) this.profile_pic(this.user.profile_pic, document.getElementById('teemboom_profile_popup_pfp'))
		else this.profile_avatar(this.user.username, document.getElementById('teemboom_profile_popup_pfp'))
	}

	live_chat(){
		// Load the socketio client script
		let socketio_script = document.createElement('script');
		socketio_script.onload = ()=>{
			this.socket = io('https://socket.teemboom.com');
			this.socket.emit('join_room', {'room': this.page_url})
			this.socket_connections()
		}
		socketio_script.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js')
		socketio_script.setAttribute('integrity', "sha512-q/dWJ3kcmjBLU4Qc47E4A9kTB4m3wuTY7vkFJDTZKjTs8jhyGQnaUrxa0Ytd0ssMZhbNua9hE+E7Qv1j+DyZwA==")
		socketio_script.setAttribute('crossorigin', "anonymous");
		document.head.appendChild(socketio_script);
	}

	socket_connections(){
		// Functions to handle socket events
		this.socket.on('display_comment', (data)=>{
			this.add_comment(data)
		})
		this.socket.on('display_like', (data)=>{
			this.add_like(data)
		})
		this.socket.on('display_dislike', (data)=>{
			this.add_dislike(data)
		})
	}

	profile_avatar(name, div){
		if (!name) name='Anonymous'
		let random_hex_color = name[0].charCodeAt(0) % this.default_hex.length
		random_hex_color = this.default_hex[random_hex_color]
		div.innerText = name[0].toUpperCase()
		div.style.background = '#'+random_hex_color
		div.style.color = '#ffffff'
	}
	profile_pic(url, div){
		let img = document.createElement('img')
		img.src = url
		div.innerHTML = ''
		div.appendChild(img)
		div.classList.add('teemboom_profile_pic')
	}


	new_popup(markdown=[], id=null){
		this.popup_close()
		let main = document.createElement('div')
		main.className = 'teemboom_popup_main'
        if (id){main.id=id}
        let popup = document.createElement('div')
        popup.className = 'teemboom_popup'
        let popup_close = document.createElement('div')
        popup_close.className = 'teemboom_popup_close'
        popup_close.innerText = 'x'
        popup_close.addEventListener('click', (e)=>{this.popup_close()})
        popup.appendChild(popup_close)
		let got_input = false
        for (let markup of markdown){
			let elem = document.createElement(markup[0])
			if (markup[1]){elem.innerHTML = markup[1]}
			if (markup[2]){
				for (let key in markup[2]){
					if (key == 'style'){
						for (let style in markup[2][key]){
							elem.style[style] = markup[2][key][style]
						}
					}
					else{
						elem[key] = markup[2][key]
					}
				}
			}
			popup.appendChild(elem)
			if (got_input == false){
				if (markup[0] == 'input'){
					setTimeout(() => {elem.focus()}, 100);
					got_input = true
				}
			}
        }
		let partition = document.createElement('div')
		partition.className = 'teemboom_popup_partition'
		partition.onclick = ()=>{
			this.popup_close()
		}
		main.appendChild(partition)
		main.appendChild(popup)
        this.main_div.appendChild(main)
	}

	popup_close(id=false){
		if (id) {document.getElementById(id).remove()}
		else{
			let popups = document.getElementsByClassName('teemboom_popup_main')
			for (let p of popups){p.remove()}
		}
	}





	// USER AUTHENTICATION
	window_messages(){
		window.addEventListener('message', (event) => {
			if (event.data.type === 'user_data') {
				this.user = event.data.payload
				if (this.user){
					if (this.main_profile_id){
						let mainProfile = document.getElementById(this.main_profile_id)
						if (this.user.profile_pic) this.profile_pic(this.user.profile_pic, mainProfile)
						else this.profile_avatar(this.user.username, mainProfile)
					}
				}
			}
			if (event.data.type === 'logout'){
				window.location.reload()
			}
			// After every data recieved, close the iframe
			let iframes = document.getElementsByClassName('teemboom_iframe')
			for (let p of iframes){p.remove()}
			this.popup_close()
		});	
	}

	initial_identification(){
		this.window_messages()
		const iframe = this.createIframe(`${this.auth_api}/comments/get_user?level=${this.config.identification}`, false)
		
	}

	get_user(){
		if (!this.user){
			this.createIframe(`${this.auth_api}/comments/sign_in_page?level=${this.config.identification}`)
			return false
		}
		let user_overview = {
			_id: this.user._id,
			username: this.user.username,
			profile_pic: this.user.profile_pic
		}
		return user_overview
	}

	logout(){
		this.createIframe(`${this.auth_api}/comments/logout?level=${this.config.identification}`, false)
	}

	createIframe(url, display=true){
		const iframe = document.createElement('iframe');
		iframe.src = url;
		iframe.classList.add('teemboom_iframe')
		if (display){
			iframe.style.width = '400px'
			iframe.style.height = '500px'
			iframe.style.maxWidth = '90vw'
			iframe.style.maxHeight = '90vh'
			iframe.style.position = 'fixed'
			iframe.style.left = '50%'
			iframe.style.top = '50%'
			iframe.style.transform = 'translate(-50%, -50%)'
			iframe.style.zIndex = 99999
			let cover = document.createElement('div')
			cover.style.width = '100vw'
			cover.style.height = '100vh'
			cover.style.position = 'fixed'
			cover.style.top = '0px';
			cover.style.left = '0px'
			cover.style.background = 'transparent'
			cover.style.zIndex = 998
			cover.addEventListener('click', ()=>{
				iframe.remove()
				cover.remove()
			})
			this.main_div.appendChild(cover)
		}else{
			iframe.style.display = 'none'
		}
		this.main_div.appendChild(iframe)
		return iframe
	}
}