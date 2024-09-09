import { h } from 'vue';
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
