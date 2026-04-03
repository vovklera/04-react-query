import styles from "./SearchBar.module.css";
import toast from "react-hot-toast";
import {Formik, Form, Field, type FormikHelpers} from "formik";

interface FormValues {
    query: string;
}

const initialValues: FormValues = {
    query: "",
}

interface SearchBarProps {
    onSubmit: (values: string) => void;
}

export default function SearchBar({onSubmit}: SearchBarProps) {
   const handleSubmit = async (
       values: FormValues,
       actions: FormikHelpers<FormValues>
   )=> {
       if (values.query.trim() === "") {
        toast.error("Please enter your search query.");
        return;
    }
       onSubmit(values.query);
       actions.resetForm();
   }

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <a
                    className={styles.link}
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by TMDB
                </a>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}>
                    <Form className={styles.form}>
                        <Field
                            className={styles.input}
                            type="text"
                            name="query"
                            autoComplete="off"
                            placeholder="Search movies..."
                            autoFocus
                        />
                        <button className={styles.button} type="submit" >
                            Search
                        </button>
                    </Form>
                </Formik>
            </div>
        </header>
    )
}