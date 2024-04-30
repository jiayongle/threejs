document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1); // Set background color to white
    document.body.appendChild(renderer.domElement);
    camera.position.z = 50;

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;

    // Sample DOT data
    // const dotString = 'digraph G { A -> B; B -> C; C -> A; }';
    const dotString = 'digraph G { A -> B; A -> D; A -> E; B -> A; B -> C; B -> F; C -> B; C -> D; C -> G; D -> A; D -> C; D -> H;    E -> A; E -> F; E -> H;    F -> B; F -> E; F -> G;    G -> C; G -> F; G -> H;    H -> D; H -> E; H -> G;}';

    function parseDot(dotData) {
        const lines = dotData.split(';');
        const nodes = {};
        const edges = [];

        lines.forEach(line => {
            line = line.trim();
            if (line.includes('->')) {
                const [from, to] = line.split('->').map(x => x.trim());
                edges.push({ from, to });
                nodes[from] = true;
                nodes[to] = true;
            }
        });

        return { nodes: Object.keys(nodes), edges };
    }

    const graph = parseDot(dotString);
    const nodeObjects = {};
    graph.nodes.forEach(node => {
        const geometry = new THREE.BoxGeometry(2, 2, 2); // Cube geometry
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = Math.random() * 40 - 20;
        cube.position.y = Math.random() * 40 - 20;
        cube.position.z = Math.random() * 40 - 20; // Positioning nodes in 3D space
        scene.add(cube);
        nodeObjects[node] = cube;
    });

    graph.edges.forEach(edge => {
        const material = new THREE.LineBasicMaterial({ color: 0x000000 });
        const start = new THREE.Vector3(nodeObjects[edge.from].position.x, nodeObjects[edge.from].position.y, nodeObjects[edge.from].position.z);
        const end = new THREE.Vector3(nodeObjects[edge.to].position.x, nodeObjects[edge.to].position.y, nodeObjects[edge.to].position.z);
        const mid = new THREE.Vector3((start.x + end.x) / 2, (start.y + end.y) / 2, (start.z + end.z) / 2 + 10); // Elevated mid-point for a 3D arc
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
});

