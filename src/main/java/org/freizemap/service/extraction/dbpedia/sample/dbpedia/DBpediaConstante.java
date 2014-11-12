package org.freizemap.service.extraction.dbpedia.sample.dbpedia;
/*
 * Copyright 2012 DBpedia Spotlight Development Team
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  Check our project website for information on how to acknowledge the authors and how to contribute to the project: http://spotlight.dbpedia.org
 */

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

/**
 * Holds all configuration parameters needed to run the DBpedia Spotlight Server
 * Reads values from a config file
 * <p/>
 * (TODO) and should validate if the inputs are acceptable, failing gracefully and early.
 * (TODO) break down configuration into smaller pieces
 *
 * @author pablomendes
 */
public class DBpediaConstante{

    
    protected Logger LOG = LoggerFactory.getLogger(this.getClass());
   
    
    //TODO could get all of these from configuration file
    public final static String DEFAULT_TEXT = "";
    public final static String DEFAULT_URL = "";
    public final static String DEFAULT_CONFIDENCE = "0.1";
    public final static String DEFAULT_SUPPORT = "10";
    public final static String DEFAULT_TYPES = "";
    public final static String DEFAULT_SPARQL = "";
    public final static String DEFAULT_POLICY = "whitelist";
    public final static String DEFAULT_COREFERENCE_RESOLUTION = "true";
    
    public static String DEFAULT_NAMESPACE = "http://dbpedia.org/resource/";
    @Deprecated
    public static String DEFAULT_ONTOLOGY_PREFIX = "http://dbpedia.org/ontology/";
    @Deprecated
    public static String DEFAULT_LANGUAGE_I18N_CODE = "en";

    public enum DisambiguationPolicy {Document, Occurrences, CuttingEdge, Default}

    private String dbpediaResource="http://dbpedia.org/resource/";

    private String dbpediaOntology="http://dbpedia.org/ontology/";

    private String language;


    public String getLanguage() {
        return language;
    }

    public String getDbpediaResource() {
        return dbpediaResource;
    }

    public String getDbpediaOntology() {
        return dbpediaOntology;
    }


    private String i18nLanguageCode = "en";


    public String getI18nLanguageCode() {
        return i18nLanguageCode;
    }

    protected String sparqlMainGraph = "http://dbpedia.org/sparql";
    protected String sparqlEndpoint = "http://dbpedia.org";

    protected long maxCacheSize = Long.MAX_VALUE;


    public String getSparqlMainGraph() {
        return sparqlMainGraph;
    }

    public String getSparqlEndpoint() {
        return sparqlEndpoint;
    }


    public long getMaxCacheSize() {
        return maxCacheSize;
    }

/*   public SpotlightConfiguration(String fileName) throws ConfigurationException {

        //read config properties
        Properties config = new Properties();
        try {
            config.load(new FileInputStream(new File(fileName)));
        } catch (IOException e) {
            throw new ConfigurationException("Cannot find configuration file " + fileName, e);
        }

        DEFAULT_NAMESPACE = config.getProperty("org.dbpedia.spotlight.default_namespace", DEFAULT_NAMESPACE);
        dbpediaResource = config.getProperty("org.dbpedia.spotlight.default_namespace", dbpediaResource);

        DEFAULT_ONTOLOGY_PREFIX = config.getProperty("org.dbpedia.spotlight.default_ontology", DEFAULT_ONTOLOGY_PREFIX);
        dbpediaOntology =config.getProperty("org.dbpedia.spotlight.default_ontology", dbpediaOntology);

        DEFAULT_LANGUAGE_I18N_CODE = config.getProperty("org.dbpedia.spotlight.language_i18n_code", DEFAULT_LANGUAGE_I18N_CODE);
        i18nLanguageCode = config.getProperty("org.dbpedia.spotlight.language_i18n_code", "en");

        //Read the spotter configuration from the properties file
        spotterConfiguration = new SpotterConfiguration(fileName);

        disambiguatorConfiguration = new DisambiguatorConfiguration(fileName);

        //set spotterFile, indexDir...
        contextIndexDirectory = disambiguatorConfiguration.contextIndexDirectory;


        //optionally use separate candidate map
        candidateMapDirectory = config.getProperty("org.dbpedia.spotlight.candidateMap.dir", "").trim();
        if (candidateMapDirectory == null || !new File(candidateMapDirectory).isDirectory()) {
            LOG.warn("Could not use the candidateMap.dir provided. Will use index.dir both for context and candidate searching.");
            candidateMapDirectory = contextIndexDirectory;
        }
        candidateMapInMemory = config.getProperty("org.dbpedia.spotlight.candidateMap.loadToMemory", "false").trim().equals("true");

        try {
            BufferedReader r = new BufferedReader(new FileReader(new File(contextIndexDirectory, similarityThresholdsFile)));
            String line;
            similarityThresholds = new ArrayList<Double>();
            while ((line = r.readLine()) != null) {
                similarityThresholds.add(Double.parseDouble(line));
            }
        } catch (FileNotFoundException e) {
            throw new ConfigurationException("Similarity threshold file '" + similarityThresholdsFile + "' not found in index directory " + contextIndexDirectory, e);
        } catch (NumberFormatException e) {
            throw new ConfigurationException("Error parsing similarity value in '" + contextIndexDirectory + "/" + similarityThresholdsFile, e);
        } catch (IOException e) {
            throw new ConfigurationException("Error reading '" + contextIndexDirectory + "/" + similarityThresholdsFile, e);
        }

        taggerFile = config.getProperty("org.dbpedia.spotlight.tagging.hmm", "").trim();
        if (taggerFile == null || !new File(taggerFile).isFile()) {
            throw new ConfigurationException("Cannot find POS tagger model file " + taggerFile);
        }

        language = config.getProperty("org.dbpedia.spotlight.language", "English");


        stopWordsFile = config.getProperty("org.dbpedia.spotlight.data.stopWords." + language.toLowerCase(), "").trim();
        if ((stopWordsFile == null) || !new File(stopWordsFile.trim()).isFile()) {
            LOG.warn("Cannot find stopwords file '" + stopWordsFile + "'. Using default Lucene Analyzer StopWords.");
        } else {
            try {
                BufferedReader bufferedReader = new BufferedReader(new FileReader(stopWordsFile.trim()));
                String line = null;
                stopWords = new HashSet<String>();
                while ((line = bufferedReader.readLine()) != null) {
                    stopWords.add(line.trim());
                }
                bufferedReader.close();
            } catch (Exception e1) {
                LOG.error("Could not read stopwords file. Using default Lucene Analyzer StopWords");
            }
        }

        analyzer = Factory.analyzer().from(
                config.getProperty("org.dbpedia.spotlight.lucene.analyzer", "org.apache.lucene.analysis.standard.StandardAnalyzer"),
                config.getProperty("org.dbpedia.spotlight.lucene.version", "LUCENE_36"), stopWords);

        serverURI = config.getProperty("org.dbpedia.spotlight.web.rest.uri", "").trim();
        if (serverURI != null && !serverURI.endsWith("/")) {
            serverURI = serverURI.concat("/");
        }
        try {
            new URI(serverURI);
        } catch (URISyntaxException e) {
            throw new ConfigurationException("Server URI not valid.", e);
        }

        // Configure lucene to accept a larger number of or queries
        BooleanQuery.setMaxClauseCount(3072);

        sparqlEndpoint = config.getProperty("org.dbpedia.spotlight.sparql.endpoint", "http://dbpedia.org/sparql").trim();
        sparqlMainGraph = config.getProperty("org.dbpedia.spotlight.sparql.graph", "http://dbpedia.org").trim();


        String maxCacheSizeString = config.getProperty("jcs.default.cacheattributes.MaxObjects", "").trim();
        try {
            maxCacheSize = new Long(maxCacheSizeString.trim());
        } catch (Exception ignored) {
            LOG.error(ignored);
        }


        **
         * These configuration parameters are for an alternative way to load DBpediaResources (from an in-memory database instead of Lucene)
         *
        String coreDbType = config.getProperty("org.dbpedia.spotlight.core.database", "").trim();
        String coreJdbcDriver = config.getProperty("org.dbpedia.spotlight.core.database.jdbcdriver", "").trim();
        String coreDbConnector = config.getProperty("org.dbpedia.spotlight.core.database.connector", "").trim();
        String coreDbUser = config.getProperty("org.dbpedia.spotlight.core.database.user", "").trim();
        String coreDbPassword = config.getProperty("org.dbpedia.spotlight.core.database.password", "").trim();
        try {
            if (coreDbType.equals("jdbc")) {
                LOG.info("Core database from JDBC: " + coreDbConnector);
                createDBpediaResourceFactory(coreJdbcDriver, coreDbConnector, coreDbUser, coreDbPassword);
            } else {
                //else we leave the factory null, in that case, lucene will be used in BaseSearcher
                LOG.info("Core database from Lucene: " + contextIndexDirectory);
            }
        } catch (Exception e) {
            LOG.warn("Tried to use core database provided, but failed. Will use Lucene index as core database.", e);
        }
        //...

    }*/


}