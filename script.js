//Vue.filter('date',time => moment(time).format("DD/MM/YY,HH:mm"))
new Vue({
	el:'#notebook',
	
	data(){
			return{
				notes:JSON.parse(localStorage.getItem('notes'))||[],
				selectID:localStorage.getItem('selected-id')||null,
	
			}
	},
	methods:{
		favoriteNote(){
			this.selectedNote.favorite = !this.selectedNote.favorite;
		},
		removeNote(){
			if(this.selectedNote&&confirm('确定删除?')){
				const index = this.notes.indexOf(this.selectedNote);
				index != -1 && this.notes.splice(index,1);
			}
		},
		saveNotes(){
			// localstorage不能保存数组对象,因此要把数组对象转化为json字符串
			localStorage.setItem('notes',JSON.stringify(this.notes));
			console.log('Notes Saved!',new Date());
			
		},
		selectNote(note){
			this.selectID = note.id
		},
		addNotes(){
			const time = Date.now();
			const note = {
				id:String(time),
				title:'New note ' + (this.notes.length + 1),
				content:'wrie here...',
				created:time,
				favorite:false,
			}
			this.notes.push(note);
		}
	},
	computed:{
		// 文本统计
		linesCount(){
			if(this.selectedNote)
				return this.selectedNote.content.split(/\r\n|\r|\n/).length
		},
		wordsCount(){
			if(this.selectedNote){
				let s = this.selectedNote.content;
				//换行符转空格
				s = s.replace(/\n/g,' ');
				// 去除收尾空格
				s = s.trim();
				// 重复空格变为一个
				s = s.replace(/\s\s+/,' ');
				return s.split(' ').length;
				
			}
			
		},
		charactersCount(){
			if(this.selectedNote)
				return this.selectedNote.content.split('').length;
		},
		sortNotes(){
			return [...this.notes].sort((a,b) => a.created - b.created)
						.sort((a,b) => a.favorite === b.favorite?0:a.favorite?-1:1)
		},
		selectedNote(){
			return this.notes.find(note => note.id === this.selectID)
		},
		notePreview(){
			return this.selectedNote.content? marked(this.selectedNote.content):''
		},
	
	},
	created(){
		this.content = localStorage.getItem('content') || '//You can write something here ..'
	},
	filters:{
		date(value){
			return moment(value).format('YYYY-MM-DD-HH:mm:ss')
		}
	},
	watch:{
		selectID(val){
			localStorage.setItem('selected-id',val)
		},
		notes:{
			handler:'saveNotes',
			// 使用这个属性来侦听数组中每个笔记属性的变化
			deep:true
		},
		content:{
			handler(val,oldVal){
				console.log('new note:',val,'old note:',oldVal);
				//使用loaclstrorage来保存笔记内容
				localStorage.setItem('content',val);
			}
		}
	}
	
	
})

const html = marked('**bold** *uioiu* [link](http://baidu.com)');
console.log(html);