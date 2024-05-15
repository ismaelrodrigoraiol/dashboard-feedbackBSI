<script setup>
import{ref, onMounted, watchEffect} from 'vue'
import FooterView from './components/FooterView.vue';
import NavbarView from './components/NavbarView.vue';
import { db } from '@/firebase'
import { collection, getDocs, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
const contagem = ref([]);
const comentarios = ref([]);
const respostasDados = ref([]);
const perguntas = ref([]);

watchEffect(() => {
  contagem.value = []
  if (respostasDados.value.length) { 
    for (let i = 0; i < perguntas.value.length; i++) {
      const pergunta = perguntas.value[i];
      const contagemIndice = {};

      for (const opcao of pergunta.opcoes) {
        contagemIndice[opcao] = 0;

      for (const resposta of respostasDados.value) {
        if (resposta.respostas[i] === opcao) {
          contagemIndice[opcao]++;
        }
      }
    }
    contagem.value.push([contagemIndice]);
  }
  }
})

watchEffect(() => {
  comentarios.value = []
    if (respostasDados.value.length) {
 
    for (let i = 0; i < respostasDados.value.length; i++) {
      const resposta = respostasDados.value[i];
        if (resposta.comentario.trim() !== "") {
          comentarios.value.push({
            comentario: resposta.comentario,
            nome: resposta.nome,
            matricula: resposta.matricula,
            data: resposta.data
           });
        }
      }
    }
})

const formatarTimestamp=(timestamp)=>{
    if (!timestamp) return '';

    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  onMounted(async() => {
	onSnapshot (collection(db, 'respostas'), (querySnapshot) => {
	let fireBaseRespostas = []
	querySnapshot.forEach((doc) => {
  	console.log(doc.id, " => ", doc.data());
	const respostas = {
		id: doc.id,
		nome: doc.data().nome,
    matricula: doc.data().matricula,
    respostas: doc.data().respostas,
    comentario: doc.data().comentario,
    data: doc.data().data
		}
	
	fireBaseRespostas.push(respostas)
})
	respostasDados.value = fireBaseRespostas
})
  })

onMounted(async() => {
	const querySnapshot = await getDocs(collection(db, 'perguntas'));
	const fireBasePerguntas = []
	querySnapshot.forEach((doc) => {
  	console.log(doc.id, " => ", doc.data());
	const perg = {
		id: doc.data().id,
		pergunta: doc.data().pergunta,
		opcoes: doc.data().opcoes
	}
	fireBasePerguntas.push(perg)
});
	perguntas.value = fireBasePerguntas
})
 
const excluir = id => {
  const res = confirm("❌ Tem certeza que deseja excluir essa resposta?")
  if (res == true){
    deleteDoc(doc(collection(db, 'respostas'), id))
  }
}
</script>

<template>
  <navbar-view/>

  <h1>Total de usuários: {{respostasDados.length}} </h1>
  <div>
    <p>Respostas por perguntas</p>
  </div>
  <div class="todo-list">
    <div class="todo-item" v-for="pergunta, perguntaIndex in perguntas" :key="perguntaIndex">
      <div>{{ pergunta.pergunta}}</div>
      <div v-for="objeto, objetoIndex in contagem[perguntaIndex]" :key="objetoIndex">
         <div class="options-resp" v-for="value, key in objeto" :key="key">
              {{ key}} - {{ value }}            
          </div>
        </div>    
      </div>
    </div>
    <section class="todo-list">
 <h1>Total de comentários enviados: {{ comentarios.length }} </h1>
 <div class="todo-item" v-for="comentario, index in comentarios" :key="index">
         <div id="cmt">    
           {{ comentario.comentario }} 
        </div>
        <div v-if="comentario.nome">
          Nome: {{ comentario.nome }}
        </div>
        <div>
          Matricula: {{ comentario.matricula }} 
        </div>       
       <div>
        <p2 id="p-2"> Enviado em {{ formatarTimestamp(comentario.data) }}</p2>
       </div>
      
 </div>
 </section>
 <section class="todo-list">
			<h1>Todas as respostas enviadas</h1>
			<div class="list" id="todo-list">

				<div class="todo-item" v-for="resposta, respostaIndex in respostasDados" :key="respostaIndex">

					<div class="todo-content" v-if="resposta.nome">
						Nome: {{ resposta.nome }}
					</div>
					<div class="todo-content">
					  Matricula:	{{resposta.matricula}}
					</div>
          <div class="todo-content">
					  Respostas:	{{resposta.respostas}}
					</div>
          <div class="todo-content" v-if="resposta.comentario">
					  Comentário:	{{resposta.comentario}}
					</div>
          <div class="todo-content">
					  <p2 id="p-2"> Enviado em {{ formatarTimestamp(resposta.data) }}</p2>
					</div>


					<div class="actions">
						<button class="delete" @click="excluir(resposta.id)">Excluir</button>
					</div>
				</div>

			</div>
		</section>
       
  <footer>
    <footer-view/>
  </footer>
 
</template>

<style scoped>
.todo-item .actions button {
	display: flex;
	padding: 0.5rem;
	border-radius: 0.25rem;
	color: #FFF;
  background-color: rgb(253, 50, 50);
	cursor: pointer;
	transition: 0.2s ease-in-out;
  align-content: right;
}
.todo-list .list {
	margin: 1rem 0;
} 

.todo-list .todo-item {
	display: flex;
  flex-direction: column;
	background-color: #ebe8e8;
	padding: 1rem;
	border-radius: 0.5rem;
	box-shadow: gray;
	margin-bottom: .5rem;
}
body {
  display: flex;
	color: rgb(54, 13, 92);
	background: rgb(199, 199, 199);
	

}
#p-2 {
  font-size: smaller;
  color:rgb(252, 47, 88)
}
#cmt {
  display: flex;
  width: 100%;
  background-color: #ffffffe1;
  border-radius: 0.5rem;
  padding: .5rem .5rem;
}
.options-resp{
  background-color: #ffffff;
  color: rgb(27, 29, 29);
  border-radius: 1rem;
  padding: 0.5rem 0.5rem;
  margin-top: 3px;
  width: 50%;
  font-weight: 500;
}
</style>