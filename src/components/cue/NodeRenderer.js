export default {
    props: {
        node: Object
    },
    setup(props) {
        return () => {
            return props.node || '';
        };
    }
};
