(this["webpackJsonpsafe-zone"]=this["webpackJsonpsafe-zone"]||[]).push([[0],{192:function(e,t,n){e.exports=n(347)},197:function(e,t,n){},298:function(e,t,n){},343:function(e,t){},347:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(2),i=n.n(o),s=(n(197),n(9)),c=n(162),l=n(163),u=n(6),h=n.n(u),m=(h.a.Bodies,window.innerWidth),f=m<700?1e4:1300;function d(e){e.forEach((function(e){return function(e){e.force=p(f)}(e)}))}function p(e){return{x:Math.random()/e*(Math.random()<.5?-1:1),y:Math.random()/e*(Math.random()<.5?-1:1)}}var g,y,b=function(){function e(){Object(c.a)(this,e),this.engine=h.a.Engine.create(),this.world=this.engine.world,this.world.gravity={x:0,y:0,scale:0},this.bots=[],this.externalUsers=new Map,this.mouseMoveCallbacks=[],this.infectedCallbacks=[],this.updateCallbacks=[],this.masks=[],this.currentlyWearingMasks=[],this.thisUserChanceOfInfection=100,this.width=700,this.height=700,this.botInitLocationX=350,this.botInitLocationY=350,this.botRadius=window.innerWidth<700?5:10,this.transmissionDistance=900,this.botColorHealthy="#42f595",this.botColorInfected="#f54e42",this.userColor="grey",this.externalUsersColors=["#fcba03","#0377fc","#fc03f0"],this.stop=!1,this.particleStatus={INFECTED:"infected",UNINFECTED:"uninfected"}}return Object(l.a)(e,[{key:"createExternalUser",value:function(e){var t=h.a.Bodies.circle(50,50,window.innerWidth<700?10:20,{friction:0,frictionAir:0,frictionStatic:0,force:{x:0,y:0},render:{strokeStyle:this.externalUsersColors[this.externalUsers.size],fillStyle:"transparent",lineWidth:3},label:e});return this.externalUsers.set(e,t),h.a.World.add(this.world,[t]),this}},{key:"addMask",value:function(e){if(!(this.masks.length>=(e||5))){var t=this.getRandomPosition(),n=h.a.Bodies.circle(t.x,t.y,20,{render:{sprite:{texture:"https://image.flaticon.com/icons/svg/2927/2927715.svg",xScale:window.innerWidth<700?.08:.1,yScale:window.innerWidth<700?.08:.1}},isSensor:!0});this.masks.push(n),h.a.World.add(this.world,n)}}},{key:"getRandomPosition",value:function(){return{x:Math.floor(Math.random()*this.width),y:Math.floor(Math.random()*this.height)}}},{key:"removeMask",value:function(e){h.a.World.remove(this.world,this.masks[e]),this.masks.splice(e,1)}},{key:"handleMasks",value:function(){var e=this.isGettingNewMask();-1!==e&&(this.decreaseInfectionChanceByOneMask(),this.removeMask(e))}},{key:"isGettingNewMask",value:function(){for(var e=0;e<this.masks.length;e++)if(h.a.Bounds.contains(this.userDot.bounds,this.masks[e].position))return e;return-1}},{key:"decreaseInfectionChanceByOneMask",value:function(){this.thisUserChanceOfInfection-=10}},{key:"increaseInfectionChanceByOneMask",value:function(){this.thisUserChanceOfInfection+=10}},{key:"resetInfectionStatus",value:function(){var e=this;this.bots.forEach((function(t){return t.label=e.particleStatus.UNINFECTED}))}},{key:"resetPositions",value:function(){var e=this;this.bots.forEach((function(t){return h.a.Body.setPosition(t,{x:e.botInitLocationX,y:e.botInitLocationY})})),h.a.Body.setPosition(this.userDot,{x:50,y:50}),this.externalUsers.forEach((function(e){return h.a.Body.setPosition(e,{x:50,y:50})}))}},{key:"setTargetPosition",value:function(e,t){this.moveBodyTo(this.externalUsers.get(e),t)}},{key:"createUser",value:function(e){return this.thisUserLabel=e,this.userDot=h.a.Bodies.circle(50,50,window.innerWidth<700?10:20,{friction:0,frictionAir:0,frictionStatic:0,force:{x:0,y:0},render:{strokeStyle:this.userColor,fillStyle:"transparent",lineWidth:3},label:e}),h.a.World.add(this.world,[this.userDot]),this}},{key:"createRender",value:function(){this.render=h.a.Render.create({canvas:this.canvasElement,engine:this.engine,options:{width:this.width,height:this.height,wireframes:!1,showAngleIndicator:!0,background:"#2c373d"}})}},{key:"getUserColor",value:function(e){return e===this.thisUserLabel?this.userColor:this.externalUsers.get(e).render.strokeStyle}},{key:"createMouse",value:function(){this.mouse=h.a.Mouse.create(this.render.canvas),this.mouseConstraint=h.a.MouseConstraint.create(this.engine,{mouse:this.mouse,constraint:{stiffness:.2,render:{visible:!0}}})}},{key:"addBot",value:function(){var e=h.a.Bodies.circle(this.botInitLocationX,this.botInitLocationY,this.botRadius,{friction:0,frictionAir:0,frictionStatic:0,force:{x:0,y:0},render:{strokeStyle:this.botColorHealthy,fillStyle:this.botColorHealthy,lineWidth:3}});return this.bots.push(e),h.a.World.add(this.world,[e]),this}},{key:"subscribeMouseMoveCallbacks",value:function(){var e=this;h.a.Events.on(this.mouseConstraint,"mousedown",(function(){console.log(e.mouseConstraint.body),e.mouseConstraint.body&&e.mouseConstraint.body.label===e.particleStatus.INFECTED&&(e.stop=!0,e.bots.forEach((function(e){return h.a.Body.setVelocity(e,{x:0,y:0})})))})),this.mouseMoveCallbacks.forEach((function(t){h.a.Events.on(e.mouseConstraint,"mousemove",(function(){t(e.mouse)}))}))}},{key:"isUserDotInfected",value:function(){var e=this;return this.bots.some((function(t){return t.label===e.particleStatus.INFECTED&&e.distance(t,e.userDot)<e.transmissionDistance}))}},{key:"addInfectedCallback",value:function(e){return this.infectedCallbacks.push(e),this}},{key:"addUpdateCallback",value:function(e){return this.updateCallbacks.push(e),this}},{key:"addMouseMoveCallback",value:function(e){return this.mouseMoveCallbacks.push(e),this}},{key:"addBots",value:function(e){for(var t=0;t<e;t++)this.addBot();return this}},{key:"stopMovement",value:function(){clearInterval(this.moveMovementInterval),this.bots.forEach((function(e){return h.a.Body.setVelocity(e,{x:0,y:0})}))}},{key:"startInfecting",value:function(){return this.bots[0].label=this.particleStatus.INFECTED,this}},{key:"distance",value:function(e,t){return(e.position.x-t.position.x)*(e.position.x-t.position.x)+(e.position.y-t.position.y)*(e.position.y-t.position.y)}},{key:"updateInfectionStatus",value:function(){for(var e=0;e<this.bots.length;e++)for(var t=e+1;t<this.bots.length;t++)this.distance(this.bots[e],this.bots[t])>this.transmissionDistance||this.bots[e].label!==this.particleStatus.INFECTED&&this.bots[t].label!==this.particleStatus.INFECTED||(this.bots[e].label=this.particleStatus.INFECTED,this.bots[t].label=this.particleStatus.INFECTED)}},{key:"updateParticlesColors",value:function(){var e=this;this.bots.forEach((function(t){t.label===e.particleStatus.INFECTED&&(t.render.fillStyle=e.botColorInfected,t.render.strokeStyle=e.botColorInfected)}))}},{key:"moveBodyTo",value:function(e,t){var n=h.a.Vector.angle(e.position,t),a=window.innerWidth<700?.003:.015;h.a.Body.setVelocity(e,{x:0,y:0}),h.a.Body.applyForce(e,e.position,{x:Math.cos(n)*a,y:Math.sin(n)*a}),h.a.Body.setAngle(e,n)}},{key:"handleMouseMove",value:function(e){this.moveBodyTo(this.userDot,e.position)}},{key:"startParticlesMovementsAndTransmission",value:function(e){var t=this;return this.moveMovementInterval=setInterval((function(){t.stop||d(t.bots),t.updateInfectionStatus(),t.updateParticlesColors(),t.isUserDotInfected()&&t.infectedCallbacks.forEach((function(e){return e(Math.random()<1-t.thisUserChanceOfInfection/100)})),t.updateCallbacks.forEach((function(e){return e(t.mouse)})),t.handleMasks()}),e||60),this}},{key:"run",value:function(){return this.createRender(),this.createMouse(),this.addMouseMoveCallback(this.handleMouseMove.bind(this)),this.subscribeMouseMoveCallbacks(),this.addWalls(),h.a.Render.run(this.render),this.runner=h.a.Runner.create(),h.a.Runner.run(this.runner,this.engine),this}},{key:"addWalls",value:function(){var e=h.a.Bodies.rectangle(this.width/2,0,this.width,2,{isStatic:!0}),t=h.a.Bodies.rectangle(this.width/2,this.height,this.width,2,{isStatic:!0}),n=h.a.Bodies.rectangle(0,this.height/2,2,this.height,{isStatic:!0}),a=h.a.Bodies.rectangle(this.width,this.height/2,2,this.height,{isStatic:!0});h.a.World.add(this.world,[e,t,n,a])}},{key:"setBotParticleOptions",value:function(e){var t=e.radius;e.color;return this.botRadius=t,this.colroRadius=t,this}},{key:"setCanvasElement",value:function(e){return this.canvasElement=e,this}},{key:"setWidthAndHeight",value:function(e,t){return this.width=e,this.height=t,this.botInitLocationX=e/2,this.botInitLocationY=t/2,this}}]),e}(),v=n(357),E=n(353),x=n(348),k=n(355),w=n(354),C=n(360),S=n(361),O=(v.a.Countdown,{message:"You got exposed but were saved by mask",type:"info"}),I={message:"You got exposed and infected",type:"error"},M={message:"You got a new mask",type:"success"};function j(e){var t=e.username,n=Object(a.useRef)(null),o=Object(a.useState)(100),i=Object(s.a)(o,2),c=i[0],l=i[1],u=Object(a.useState)([]),h=Object(s.a)(u,2),m=h[0],f=h[1],d=Object(a.useState)(0),p=Object(s.a)(d,2),v=p[0],C=p[1],j=Object(a.useState)(!1),D=Object(s.a)(j,2),U=D[0],R=D[1],W=!0,A=Object(a.useState)(32),L=Object(s.a)(A,2),P=L[0],z=L[1],N=!1;Object(a.useEffect)((function(){var e=setInterval((function(){z((function(e){return 1===e?(n.current.stopMovement(),R(!0),N||(fetch("/api/".concat(t,"/score"),{method:"POST",body:JSON.stringify({score:g}),headers:{"Content-Type":"application/json"}}).then((function(e){return console.log(e)})),N=!0),clearInterval(y),1):e-1}))}),1e3);return function(){return clearInterval(e)}}),[]),Object(a.useEffect)((function(){f((function(e){return e.concat(M)})),f((function(e){return e.slice(e.length-4,e.length)}))}),[c]);var F=function(e){W&&(e?f((function(e){return e.concat(O)})):(f((function(e){return e.concat(I)})),C((function(e){return e-30}))),f((function(e){return e.slice(Math.max(0,e.length-4),e.length)})),W=!1,setTimeout((function(){W=!0}),500))},Y=Object(a.useCallback)((function(e){if(null!=e){var t=(new b).setCanvasElement(e).setWidthAndHeight(B().width,B().height).addBots(window.innerWidth<700?10:20).createUser().startParticlesMovementsAndTransmission(60).addInfectedCallback(F).run();n.current=t,setTimeout((function(){return t.startInfecting()}),2e3),y=setInterval((function(){c!==Math.max(0,t.thisUserChanceOfInfection)&&l((function(e){return Math.max(0,t.thisUserChanceOfInfection)})),C((function(e){return e+5}))}),500),setInterval((function(){t.addMask()}),2e3)}}),[]);return r.a.createElement("div",null,r.a.createElement(E.a,{onBack:function(){},title:t,backIcon:r.a.createElement(x.a,{title:"Are you sure you want to exit?",onConfirm:function(){return window.location.href="/HTML-shell/main.html"}},r.a.createElement(S.a,{style:{fontSize:"20px"}})),extra:[r.a.createElement(k.a,{type:"circle",percent:(30-P)/30*100,format:function(e){return"".concat(P," seconds")}})]}),r.a.createElement("div",{style:{display:"flex",flexDirection:"row",flexWrap:"wrap",marginRight:"50px"}},r.a.createElement("div",{style:{textAlign:"center",flexGrow:3}},r.a.createElement("canvas",{style:{display:"inline"},width:"900",height:"900",ref:Y})),r.a.createElement("div",{style:{textAlign:"center",margin:"50px",marginTop:"0px"}},r.a.createElement("h1",null,"Score: ",v),r.a.createElement("h2",null,"Chance of infection: ",c),r.a.createElement(k.a,{percent:c,showInfo:!0,strokeColor:"#1890ff",size:"large"}),r.a.createElement(T,{logs:m}))),r.a.createElement(w.a,{title:r.a.createElement("h1",null,"GAME ENDED"),visible:U,okText:"Play Again!",cancelText:"See Leaderboard",onCancel:function(){return window.location.href="/ejs/leaderboard"},onOk:function(){return window.location.reload()}},r.a.createElement("h2",null,"Your score:",(g=v,v))))}function T(e){var t=e.logs;return r.a.createElement("div",{style:{margin:"10px",border:"1px solid #1890FF",borderRadius:"5px",width:"300px"}},r.a.createElement("h2",{style:{marginTop:"5px"}},"Game Logs"),t.map((function(e){return r.a.createElement(C.a,{style:{margin:"10px"},type:e.type,closable:!1,message:r.a.createElement("h2",null,e.message)})})))}function B(){var e={width:300,height:300},t={width:400,height:400},n={width:600,height:600},a=window.innerWidth;return a<400?e:a<700?t:n}var D=n(187),U=n(12),R=n(172),W=n(362);function A(e){var t=e.username;return r.a.createElement("div",{style:{margin:"20px"}},r.a.createElement("a",{href:"HTML-shell/main.html"},r.a.createElement(S.a,{style:{fontSize:"35px",marginTop:"20px",marginLeft:"20px"}})),r.a.createElement("div",{style:{marginTop:"20px",display:"flex",flexDirection:"row"}},r.a.createElement("h1",{style:{margin:"20px",fontSize:"35px"}},r.a.createElement(R.a,{size:64,icon:r.a.createElement(W.a,null)}),r.a.createElement("span",{style:{margin:"20px"}},t))))}n(298);var L=n(63),P=n.n(L),z=n(96),N=n(356),F=n(16),Y=n(359),H=n(358),J=n(363),G=N.a.TextArea;function V(){var e=Object(a.useState)(!1),t=Object(s.a)(e,2),n=t[0],o=t[1],i=Object(a.useState)(""),c=Object(s.a)(i,2),l=c[0],u=c[1],h=function(){var e=Object(z.a)(P.a.mark((function e(){return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o(!0),console.log(l),e.next=4,fetch("/api/feedback",{method:"POST","Content-Type":"application/json",body:{feedback:l}});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return r.a.createElement("div",null,r.a.createElement("div",{style:{margin:"20px"}},r.a.createElement("a",{href:"/HTML-shell/main.html"},r.a.createElement(S.a,{style:{fontSize:"20px"}})),r.a.createElement(F.a,{href:"/HTML-shell/aboutus.html",type:"link",style:{float:"right"}},"About us")),n?r.a.createElement(Y.a,{icon:r.a.createElement(J.a,null),title:"Thank you for your feedback!",subTitle:"your feedback was send to the developers"}):r.a.createElement("div",{style:{textAlign:"center",display:"flex",flexDirection:"column"}},r.a.createElement("h1",null,"Tell us what you think!"),r.a.createElement(G,{onChange:function(e){return u(e.target.value)},style:{margin:"auto",width:"50%"},rows:4}),r.a.createElement("div",{style:{margin:"auto",width:"50%",marginTop:"20px"}},r.a.createElement("label",null,"Our Rating "),r.a.createElement(H.a,{style:{margin:"5px"},defaultValue:5,character:r.a.createElement(J.a,null),allowHalf:!0}),r.a.createElement(F.a,{onClick:h,style:{margin:"5px"},size:"large",type:"primary"},"Send Feedback"),r.a.createElement("h4",{style:{marginTop:"50px"}},"Or email us at:",r.a.createElement("a",{style:{marginLeft:"5px"},href:"mailto:safezonemanagment@gmail.com"},"safezonemanagment@gmail.com")))))}var X=n(351),$=n(184),q=n(349),K=n(352),Q=n(64),Z=n(350);function _(e){var t=Object(a.useState)([]),n=Object(s.a)(t,2),o=n[0],i=n[1],c=Object(a.useState)(!1),l=Object(s.a)(c,2),u=l[0],h=l[1];e.socket.off("chatroom-message").on("chatroom-message",(function(e){h(!0),i((function(t){return t.concat(e)})),i((function(e){return e.slice(e.length-12,e.length)}))}));var m=Object(a.useState)(""),f=Object(s.a)(m,2),d=f[0],p=f[1];return r.a.createElement("div",{style:{position:"relative",border:"1px solid #1890FF",padding:"30px",marginRight:"10px",marginLeft:"20px",width:"500px",borderRadius:"10px"}},r.a.createElement("h1",null,"Chatroom"),r.a.createElement(q.a,null),r.a.createElement(K.b,{style:{height:"500px"},itemLayout:"horizontal"},u?o.map((function(e){return r.a.createElement(K.b.Item,{key:e.username},r.a.createElement(K.b.Item.Meta,{avatar:r.a.createElement(R.a,null),title:e.username,description:e.message}))})):r.a.createElement(Q.a,{description:"No message yet"})),r.a.createElement(Z.a,null),r.a.createElement("div",{style:{position:"absolute",bottom:0,marginBottom:"30px"}},r.a.createElement(N.a,{placeholder:"Enter a message",size:"large",style:{margin:"auto",width:"400px"},onChange:function(e){return p(e.target.value)}}),r.a.createElement(q.a,{type:"vertical"}),r.a.createElement(F.a,{size:"large",style:{marginTop:"10px"},onClick:function(){console.log("sending",d),e.socket.emit("chatroom-message",{username:sessionStorage.getItem("username"),message:d}),console.log(o)},type:"primary"},"Send")))}function ee(e){var t,n,o=e.socket,i=e.username,c=localStorage.getItem("room-id"),l=Object(a.useState)([i]),u=Object(s.a)(l,2),h=u[0],m=u[1],f=Object(a.useState)([]),d=Object(s.a)(f,2),p=d[0],g=d[1],y=Object(a.useState)(100),v=Object(s.a)(y,2),C=v[0],O=v[1],I=Object(a.useState)([]),M=Object(s.a)(I,2),j=M[0],T=M[1],B=Object(a.useState)(0),D=Object(s.a)(B,2),U=D[0],R=D[1],W=Object(a.useState)(!1),A=Object(s.a)(W,2),L=A[0],P=A[1],z=!0,N=Object(a.useState)(32),F=Object(s.a)(N,2),Y=F[0],H=F[1],J=!1,G={message:"You got exposed but were saved by mask",type:"info"},V={message:"You got exposed and infected",type:"error"},X={message:"You got a new mask",type:"success"};Object(a.useEffect)((function(){var e=setInterval((function(){H((function(e){return 1===e?(q.current.stopMovement(),P(!0),J||(fetch("/api/".concat(i,"/score"),{method:"POST",body:JSON.stringify({score:t}),headers:{"Content-Type":"application/json"}}).then((function(e){return console.log(e)})),J=!0),clearInterval(n),1):e-1}))}),1e3);return function(){return clearInterval(e)}}),[]),Object(a.useEffect)((function(){T((function(e){return e.concat(X)})),T((function(e){return e.slice(e.length-4,e.length)}))}),[C]);var $=function(e){z&&(e?T((function(e){return e.concat(G)})):(T((function(e){return e.concat(V)})),R((function(e){return e-30}))),T((function(e){return e.slice(Math.max(0,e.length-4),e.length)})),z=!1,setTimeout((function(){z=!0}),500))};Object(a.useEffect)((function(){o.emit(re.joinRoom,c,i)}),[o,c,i]),o.off(re.mousePosition).on(re.mousePosition,(function(e,t){i!==e&&q.current.setTargetPosition(e,t)})),o.off(re.allJoinedUsers).on(re.allJoinedUsers,(function(e){console.log("got all users ".concat(JSON.stringify(e)));for(var t=function(t){-1===h.indexOf(e[t])&&(q.current.createExternalUser(e[t]),m((function(n){return n.concat(e[t])})),g((function(n){return n.concat(q.current.getUserColor(e[t]))})))},n=0;n<e.length;n++)t(n)}));var q=Object(a.useRef)(null),K=Object(a.useCallback)((function(e){if(null!=e){var t=(new b).setCanvasElement(e).setWidthAndHeight(ae().width,ae().height).addBots(10).createUser().startParticlesMovementsAndTransmission(60).addInfectedCallback((function(){return console.log("infected!")})).addMouseMoveCallback((function(e){o.emit(re.mousePosition,i,e.position)})).addInfectedCallback($).run();q.current=t,setTimeout((function(){return t.startInfecting()}),2e3),n=setInterval((function(){C!==Math.max(0,t.thisUserChanceOfInfection)&&O((function(e){return Math.max(0,t.thisUserChanceOfInfection)})),R((function(e){return e+5}))}),500),setInterval((function(){t.addMask()}),2e3)}}),[]);return r.a.createElement("div",null,r.a.createElement(E.a,{onBack:function(){return null},title:i,subTitle:"Multiplayer lobby ".concat(c),backIcon:r.a.createElement(x.a,{title:"Are you sure you want to leave the room?"},r.a.createElement(S.a,{style:{fontSize:"20px"}})),extra:[r.a.createElement(ne,{users:h,colors:p})]}),r.a.createElement("div",{style:{display:"flex",flexDirection:"row",flexWrap:"wrap"}},r.a.createElement("div",null,r.a.createElement(k.a,{style:{marginLeft:"150px"},type:"circle",percent:(30-Y)/30*100,format:function(e){return"".concat(Y," seconds")}}),r.a.createElement("div",{style:{textAlign:"center",margin:"50px",marginTop:"0px"}},r.a.createElement("h1",null,"Score: ",U),r.a.createElement("h2",null,"Chance of infection: ",C),r.a.createElement(k.a,{percent:C,showInfo:!0,strokeColor:"#1890ff",size:"large"}),r.a.createElement(te,{logs:j}))),r.a.createElement("div",null,r.a.createElement("canvas",{style:{margin:"20px",marginTop:"20px"},width:"900",height:"900",ref:K})),r.a.createElement(_,{socket:o})),r.a.createElement(w.a,{title:r.a.createElement("h1",null,"GAME ENDED"),visible:L,okText:"Play Again!",cancelText:"See Leaderboard",onCancel:function(){return window.location.href="/ejs/leaderboard"},onOk:function(){return window.location.reload()}},r.a.createElement("h2",null,"Your score:",(t=U,U))))}function te(e){var t=e.logs;return r.a.createElement("div",{style:{margin:"10px",border:"1px solid #1890FF",borderRadius:"5px",width:"300px"}},r.a.createElement("h2",{style:{marginTop:"5px"}},"Game Logs"),t.map((function(e){return r.a.createElement(C.a,{style:{margin:"10px"},type:e.type,closable:!1,message:r.a.createElement("h2",null,e.message)})})))}function ne(e){var t=e.users,n=e.colors,o=function(){var e=Object(z.a)(P.a.mark((function e(t){var n,a,o;return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/".concat(t,"/maxscore"));case 2:if(200===(n=e.sent).status){e.next=5;break}return e.abrupt("return","");case 5:return e.next=7,n.json();case 7:return n=e.sent,a=n.macScore,e.next=11,fetch("/api/".concat(t,"/gameplayed"));case 11:return n=e.sent,e.next=14,n.json();case 14:return n=e.sent,o=n.gamesPlayed,e.abrupt("return",r.a.createElement("div",null,r.a.createElement("p",null,"Max Score: ",a),r.a.createElement("p",null,"Games played: ",o)));case 17:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),i=Object(a.useState)([]),c=Object(s.a)(i,2),l=c[0],u=c[1];return Object(a.useEffect)((function(){var e=t.map((function(e){return o(e)}));Promise.all(e).then((function(e){return u(e)}))}),[t]),r.a.createElement("div",null,t.map((function(e,t){return r.a.createElement(X.a,{key:e,title:e,content:function(){return""===l[t]?r.a.createElement($.a,null):l[t]}},r.a.createElement(R.a,{style:{backgroundColor:n[t]},icon:r.a.createElement(W.a,null)}))})))}function ae(){var e={width:300,height:300},t={width:400,height:400},n={width:600,height:600},a=window.innerWidth;return a<400?e:a<700?t:n}var re={joinRoom:"join-room",createRoom:"createRoom",newUserJoined:"new-user-joined",chatroomMessage:"chatroom-message",mousePosition:"mouse-position",roomCreated:"room-created",allJoinedUsers:"all-joined-users"},oe="createRoom",ie="room-created";function se(e){var t=e.socket,n=(e.username,e.changeRoomID,Object(a.useState)(!1)),o=Object(s.a)(n,2),i=o[0],c=o[1],l=Object(a.useState)(0),u=Object(s.a)(l,2),h=u[0],m=u[1];return r.a.createElement("div",{style:{margin:"20px",textAlign:"center",display:"flex",flexDirection:"column"}},r.a.createElement("div",null,r.a.createElement("a",{href:"/HTML-shell/main.html",style:{color:"#3aa89b",fontSize:"20pt"}},r.a.createElement(S.a,{style:{float:"left",fontSize:"20pt"}})),r.a.createElement(F.a,{href:"/HTML-shell/aboutus.html",type:"link",style:{float:"right",fontSize:"20pt",color:"#3aa89b"}},"About us")),r.a.createElement("div",null,r.a.createElement("h1",null,"Multiplayer Mode"),r.a.createElement("div",{style:{display:"flex",flexDirection:"column"}},r.a.createElement(F.a,{loading:i,onClick:function(){c(!0),t.emit(oe),t.off(ie).on(ie,(function(e){c(!1),w.a.success({title:"Your room was created",content:"Your room id is: ".concat(e),okText:"Go to the room!",onOk:function(){return window.location.href="/react/multiplayer"}}),localStorage.setItem("room-id",e)}))},style:{backgroundColor:"#3aa89b",margin:"auto",width:"60%",marginTop:"10px",fontSize:"25px",height:"50px",borderRadius:"5px",marginBottom:"10px"},type:"primary"},"Create new room"),r.a.createElement("p",null,"Or"),r.a.createElement("div",{style:{margin:"auto",width:"60%",display:"flex",flexDirection:"row"}},r.a.createElement(N.a,{onChange:function(e){return m(e.target.value)},style:{margin:"auto",fontSize:"25px",height:"50px"},placeholder:"1234"}),r.a.createElement(F.a,{style:{backgroundColor:"#3aa89b",margin:"auto",width:"60%",marginTop:"10px",fontSize:"25px",height:"50px",borderRadius:"5px",marginBottom:"10px"},type:"primary",onClick:function(){localStorage.setItem("room-id",h),window.location.href="/react/multiplayer"}},"Join a room")))))}var ce=n(186),le=n.n(ce);var ue=function(){var e=le.a.connect(),t=localStorage.getItem("username"),n=Object(a.useState)(null),o=Object(s.a)(n,2),i=(o[0],o[1]);return r.a.createElement(D.a,null,r.a.createElement(U.c,null,r.a.createElement(U.a,{path:"/react/single"},r.a.createElement(j,{username:t})),r.a.createElement(U.a,{path:"/react/myAccount"},r.a.createElement(A,{username:t})," socket=",e),r.a.createElement(U.a,{path:"/react/feedback"},r.a.createElement(V,null)),r.a.createElement(U.a,{path:"/react/multiplayer"},r.a.createElement(ee,{socket:e,username:t,roomID:void 0})),r.a.createElement(U.a,{path:"/react/chooseroom"},r.a.createElement(se,{socket:e,username:t,changeRoomID:function(e){i(e),localStorage.setItem("room-id",e)}}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(ue,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[192,1,2]]]);
//# sourceMappingURL=main.08d1e9c3.chunk.js.map