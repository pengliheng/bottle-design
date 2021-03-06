import {
	Scene, 
	PerspectiveCamera, 
	WebGLRenderer, 
	CylinderGeometry,
	MeshBasicMaterial, 
	Mesh,
	AmbientLight,
	SphereGeometry,
	MeshPhongMaterial,
	ImageUtils,
} from "three";
import {
	to_image_rgba,
	get_black_area
} from "../feature/Tool.js";

class Canvas {
	static canvas_background(
		canvas,
		image,
		store,
		canvas_prop = {
			height: screen.height-93 > 600 ? 600 : screen.height-93 ,
			width: screen.width > 400 ? 400 : screen.width,
		},
		image_prop = {
			fill:"height",
			width: 500,
			height: 670,
		}
	) {
		/**
         * @param  		{canvas} 
         * @argument  	{
		 * 					canvas元素	  必要参数
		 * 					store,			必要参数
		 * 					canvas_prop,  	非必要参数
		 * 					image_prop,		非必要参数
		 * 				} 
         * @return 		{string|json} canvas auto to draw background 
         */
		window.image = image;
		const ctx = canvas.getContext("2d");
		Canvas.canvas = canvas;
		Canvas.store = store;
		//重绘背景
		ctx.clearRect(0, 0, canvas_prop.width, canvas_prop.height);
		//背景图坐标系
		ctx.save();
		ctx.scale(-1, 1);
		ctx.translate(
			-canvas_prop.width*0.5,
			canvas_prop.height*0.5
		); 
		ctx.rotate(0);
		let proportion = (image_prop.width/image_prop.height)/(canvas_prop.width/canvas_prop.height);
		if (image_prop.fill == "height") {
			//image height to fill
			ctx.drawImage(
				image,
				-canvas_prop.width/2*proportion,
				-canvas_prop.height/2,
				canvas_prop.width*proportion,
				canvas_prop.height
			);
			canvas_prop.height;
		}else if (Image_prop.fill == "width") {
			//image width to fill
			ctx.drawImage(
				image,
				-canvas_prop.width/2,
				-canvas_prop.height/2*proportion,
				canvas_prop.width,
				canvas_prop.height*proportion
			);
		}
		ctx.restore();
		Canvas.realize_picture();
	}


	static realize_picture(){
		const {
			canvas,
			store
		} = Canvas;
		const {
			allHold,
			block_props,
			bottle_rgba
		} = store;
		//////////realize rgba
		let _ctx = canvas.getContext("2d");
		let data = _ctx.getImageData(
			0, 
			0, 
			canvas.width, 
			canvas.height
		).data;
		data = to_image_rgba(
			data,
			canvas.width, 
			canvas.height
		);
		let area = get_black_area(data,bottle_rgba,canvas);
		//////////realize rgba
		const { _x, __x, _y, __y } = area;
		allHold("block_props",Object.assign({},block_props,{
			x: (_x + __x) / 2,
			y: (_y + __y) / 2,
			width: (__x - _x),
			height: (__y - _y)
		}));
	}


	static canvas_background_3d(
		canvas,
		image_url,
		toggle_show=true
	){
		if(toggle_show){
			const scene = new Scene();
			let width = screen.width > 400 ? 400 : screen.width;
			let height = screen.height-93 > 600 ? 600 : screen.height-93;
			const camera = new PerspectiveCamera(75, width/height, 0.1, 1000);
			const renderer = new WebGLRenderer();
			
			//场景宽高设定
			renderer.setSize(width, height);
			renderer.setClearColor( 0xffffff, 1 );
			//canvas元素style设定
			renderer.domElement.style.zIndex = "2";
			renderer.domElement.id = "three_toggle_show";
			document.getElementsByClassName("content-container-show")[0].appendChild(renderer.domElement);

			// 1.底部半径
			// 2.顶部半径
			// 3.高度
			// 4.分段  ---  圆精确度

			//圆柱 ---红色 突出
			const ___Cylinder = new CylinderGeometry(1.1, 1.1, 0.6 , 32);
			//材质
			const ___cylinder_material = new MeshBasicMaterial({color: "rgb(125, 25, 31)"});
			const ___cylinder = new Mesh(___Cylinder, ___cylinder_material);
			___cylinder.position.set(0,14.7,0);


			//圆柱 --- 红色
			const __Cylinder = new CylinderGeometry(1, 1, 3.5 , 32);
			//材质
			const __cylinder_material = new MeshBasicMaterial({color: "rgb(125, 25, 31)"});
			const __cylinder = new Mesh(__Cylinder, __cylinder_material);
			__cylinder.position.set(0,13.7,0);


			//圆柱 ---  黑色
			const _Cylinder = new CylinderGeometry(1, 1, 1.3 , 32);
			//材质
			const _cylinder_material = new MeshPhongMaterial({color: "rgb(31, 31, 31)"});
			const _cylinder = new Mesh(_Cylinder, _cylinder_material);
			_cylinder.position.set(0,11.3,0);




			//椭圆 ---  黑色
			const Cuby = new SphereGeometry( 3, 32, 32);
			//材质
			const cuby_material = new MeshPhongMaterial({color: "rgb(31, 31, 31)"});
			const cuby = new Mesh(Cuby, cuby_material);
			cuby.position.set(0,8,0);



			//圆柱 ---  黑色
			const Cylinder = new CylinderGeometry(3, 3, 16 , 32);
			//材质
			const cylinder_material = new MeshPhongMaterial({color: "rgb(31, 31, 31)"});
			const cylinder = new Mesh(Cylinder, cylinder_material);
			cylinder.position.set(0,-3,0);

			
			//////////////////////////////////////////////////////////////////////////////////////
			//圆柱 -----   表面贴图
			const Cylinder_image = new CylinderGeometry(3.01, 3.01, 14 , 32);
			//材质
			const cylinder_material_image = new MeshBasicMaterial({
				map: ImageUtils.loadTexture(image_url) 
			});
			const cylinder_image = new Mesh(Cylinder_image, cylinder_material_image);
			cylinder_image.position.set(0,0,0);
			//////////////////////////////////////////////////////////////////////////////////////

			cylinder.add(___cylinder);
			cylinder.add(__cylinder);
			cylinder.add(_cylinder);
			cylinder.add(cylinder_image);
			cylinder.add(cuby);

			//添加光源
			const light = new AmbientLight( 0x404040 );
			scene.add( light );

			scene.add(cylinder);

			camera.position.z = 20;
			camera.position.y = 1.5;
			cylinder.rotation.y = -1.8;
			const render = () =>{
				requestAnimationFrame(render);
				cylinder.rotation.x = 0;
				cylinder.rotation.y += 0.01;
				cylinder.rotation.z = 0.3;
				// cylinder.rotation.z = 0;
				renderer.render(scene, camera);
			};
			render();
		}else{
			document.getElementById("three_toggle_show").remove();
		}
		return !toggle_show;
	}
}
module.exports = exports = Canvas;